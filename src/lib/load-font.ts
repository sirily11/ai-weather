import {continueRender, delayRender, staticFile} from 'remotion';

export const loadFont = async () => {
	const waitForFont = delayRender();
	const font = new FontFace(
		`SatoshiBold`,
		`url('${staticFile('/fonts/satoshi-bold.woff2')}') format("woff2")`
	);

	console.log('font', JSON.stringify(font, null, 2));

	console.log('Loading font...');

	try {
		const loadedFont = await font.load();

		document.fonts.add(loadedFont);

		continueRender(waitForFont);
	} catch (e) {
		console.log(e);
	}
};
