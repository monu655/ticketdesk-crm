import Button from './Button.jsx';
import { AlertIcon } from './icons.jsx';

export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertIcon />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
