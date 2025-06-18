// src/components.d.ts

/**
 * Custom HTML element: <iconify-icon>
 *
 * Renders an SVG icon from the Iconify icon collection.
 * Use the `icon` attribute to specify the icon, e.g., "mdi:home".
 *
 * This element can be used in any modern HTML or framework environment (e.g., Svelte, Vue, React).
 * It supports optional props like `color`, `width`, `height`, `rotate`, `flip`, and more.
 *
 * Docs: https://docs.iconify.design/icon-components/web-component/
 * Icon sets: https://icon-sets.iconify.design/
 */
declare namespace svelteHTML {
	interface IntrinsicElements {
		/**
		 * The <iconify-icon> custom element renders vector icons using the Iconify framework.
		 *
		 * Specify the icon via the `icon` attribute (e.g., "mdi:home").
		 * You can control styling with standard attributes like `width`, `height`, and `color`.
		 */
		'iconify-icon': {
			/**
			 * Icon name in format "prefix:name", e.g., "mdi:home"
			 */
			icon?: string;

			/**
			 * Aligns the icon inline with surrounding text.
			 */
			inline?: boolean;

			/**
			 * Rotates the icon (1 = 90°, 2 = 180°, 3 = 270° or use degrees like "90deg").
			 */
			rotate?: string | number;

			/**
			 * Flips the icon: "horizontal", "vertical", or both.
			 */
			flip?: string;

			/**
			 * Fill color of the icon (any CSS color value).
			 */
			color?: string;

			/**
			 * Width of the icon (e.g., "24px", "1.5em").
			 */
			width?: string | number;

			/**
			 * Height of the icon.
			 */
			height?: string | number;

			/**
			 * CSS classes to apply.
			 */
			class?: string;

			/**
			 * Tooltip or accessible label.
			 */
			title?: string;

			/**
			 * Hides the icon from screen readers.
			 */
			'aria-hidden'?: boolean | 'true' | 'false';

			/**
			 * Element ID.
			 */
			id?: string;

			/**
			 * Allows additional attributes like data-* or style.
			 */
			[key: string]: any;
		};
	}
}
