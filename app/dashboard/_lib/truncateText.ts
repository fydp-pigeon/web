export const truncateText = ({ text, numChars }: { text: string; numChars: number }) =>
  text.length > numChars ? text.slice(0, numChars) + '...' : text;
