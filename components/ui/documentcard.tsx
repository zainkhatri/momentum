import Image from "next/image";

interface DocumentCardProps {
  title: string;
  timestamp: string;
  onClick: () => void;
}

export default function DocumentCard({ title, timestamp, onClick }: DocumentCardProps) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-lg shadow w-[280px] sm:w-[300px] md:w-[320px] border border-gray-500 cursor-pointer ml-8 bg-gray-900">
      <div className="bg-gray-800 h-40 w-auto mt-2 mx-2 mb-2 flex items-center justify-center rounded">
        <Image src="/Document.svg" alt="Document Icon" width={50} height={40} />
      </div>
      <div className="mt-4 mx-2">
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{timestamp}</p>
      </div>
    </div>
  );
}

