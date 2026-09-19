import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { buttonClasses } from '../utils/buttonStyles.js';

export default function NotFoundPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Link to="/" className={buttonClasses('secondary')}>
            Back to tickets
          </Link>
        }
      />
    </div>
  );
}
