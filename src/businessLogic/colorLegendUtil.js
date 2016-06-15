export default class ColorLegendUtil {

	constructor(
		width, height, margins, // Values from the chart we are inserting into
		position = "top-left", // Where the labels should be positioned
		rectWidth = 20, rectHeight = 8, // Size for rect that will display color
		leftOffset = 5, topOffset = 15, // Offset between rect and text
		rightOffset = 70 // Offset to be applied for the right-side in case we are positioning there
		) {
			
		this.width = width;
		this.height = height;
		this.margins = margins;

		this.rectWidth = rectWidth;
		this.rectHeight = rectHeight;
		this.leftOffset = leftOffset;
		this.topOffset = topOffset;

		// Usually we want this to be as long as the labels we want to display
		this.rightOffset = rightOffset;

		this.position = position;
	}

	static get rectWidth() {
		return this.rectWidth;
	}

	static get rectHeight() {
		return this.rectHeight;
	}

	// Generate x,y coords for rect and text. Takes into consideration the index for each label,
	// once we have to offset to display them stacked
	generateCoords(i) {

		// Y coordinates
		const yTextOffset = this.rectHeight;

		const bottomRect = (this.height - this.margins.bottom - this.topOffset) - this.rectHeight - i * this.topOffset;
		const bottomText = bottomRect + yTextOffset;

		const topRect = this.margins.top - this.rectHeight + i * this.topOffset;
		const topText = topRect + yTextOffset;

		// X coordinates
		const xTextOffset = this.rectWidth + this.leftOffset;

		const leftRect = this.margins.left + this.rectWidth;
		const leftText = leftRect + xTextOffset;

		const centerRect = this.width / 2;
		const centerText = centerRect + xTextOffset;

		const rightRect = this.width - this.margins.right - this.rightOffset - this.rectWidth;
		const rightText = rightRect + xTextOffset;

		switch (this.position) {
			case "bottom-left":
				return {
					rectX: leftRect,
					rectY: bottomRect,
					textX: leftText,
					textY: bottomText
				};
			case "bottom-center":
				return {
					rectX: centerRect,
					rectY: bottomRect,
					textX: centerText,
					textY: bottomText
				};
			case "top-center":
				return {
					rectX: centerRect,
					rectY: topRect,
					textX: centerText,
					textY: topText
				};

			case "top-right":
				return {
					rectX: rightRect,
					rectY: topRect,
					textX: rightText,
					textY: topText
				};
			case "bottom-right":
				return {
					rectX: rightRect,
					rectY: bottomRect,
					textX: rightText,
					textY: bottomText
				};

			default:
			case "top-left":
				return {
					rectX: leftRect,
					rectY: topRect,
					textX: leftText,
					textY: topText
				};			
		}
	}
}