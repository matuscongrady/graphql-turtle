declare module '*.graphql' {
	const value: string;
	export default value;
}

declare module '*.json' {
	const value: any;
	export default value;
}

declare module '*.png' {
	const value: any;
	export default value;
}

declare module '*.jpg' {
	const value: any;
	export default value;
}

interface HTMLElementRef extends HTMLElement {
	reset(): void;
	execute(): void;
}
