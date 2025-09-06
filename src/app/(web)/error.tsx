'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='container mx-auto'>
      <h2 className='font-heading text-red-800 mb-10'>Algo salió mal!</h2>

      <button onClick={() => reset()} className='btn-primary'>
        Intenta de nuevo
      </button>
    </div>
  );
}