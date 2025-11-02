export default function DropIndicator({
  beforeId,
  column,
}: {
  beforeId: string | null;
  column: string;
}) {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className='my-0.5 h-0.5 w-full bg-green-300 opacity-0'
    />
  );
}
