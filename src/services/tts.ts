import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  SpeechConfig,
  SpeechSynthesisResult,
  SpeechSynthesizer,
  ResultReason,
  AudioConfig,
  AudioOutputStream,
} from "microsoft-cognitiveservices-speech-sdk";

export const getFileName = ({
  sessionId,
  index,
}: {
  sessionId: string;
  index: string;
}) => {
  const speaker = process.env.AZURE_SPEAKER_NAME;
  return `${sessionId}-${index}-${speaker}.mp3`;
};

export const getCustomDownloadUrl = (fileName: string) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  return `${process.env.AWS_S3_CUSTOM_DOMAIN}/${bucketName}/${fileName}`;
};

export const exists = async (sessionId: string, index: string) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  const s3 = new S3Client({
    region: process.env.AWS_S3_REGION!,
    endpoint: process.env.AWS_S3_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: getFileName({ sessionId, index }),
      }),
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const synthesizeSpeech = async (
  text: string,
  sessionId: string,
  index: string,
): Promise<string> => {
  if (await exists(sessionId, index)) {
    return getCustomDownloadUrl(
      getFileName({
        sessionId,
        index,
      }),
    );
  }

  const speechConfig = SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_API_KEY!,
    process.env.AZURE_SPEECH_ENDPOINT!,
  );

  const fileName = getFileName({ sessionId, index });
  const stream = AudioOutputStream.createPullStream();
  const audioConfig = AudioConfig.fromStreamOutput(stream);

  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  const ssml = `
                <speak version="1.0" xml:lang="en-US">
									<voice name="${process.env.AZURE_SPEAKER_NAME!}">
										${text}
									</voice>
                </speak>`.trim();

  const result = await new Promise<SpeechSynthesisResult>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (res) => {
        if (res.reason === ResultReason.SynthesizingAudioCompleted) {
          resolve(res);
        } else if (res.errorDetails) {
          reject(new Error(res.errorDetails));
        } else {
          reject(new Error("Speech Synthesis Error"));
        }
      },
      (error) => {
        reject(error);
        synthesizer.close();
      },
    );
  });
  const { audioData } = result;
  synthesizer.close();
  return uploadTtsToS3(audioData, fileName);
};

export const uploadTtsToS3 = async (data: ArrayBuffer, fileName: string) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  const awsRegion = process.env.AWS_S3_REGION;
  const s3 = new S3Client({
    region: awsRegion,
    endpoint: process.env.AWS_S3_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: new Uint8Array(data),
    }),
  );

  return getCustomDownloadUrl(fileName);
};
