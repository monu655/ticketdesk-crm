import { buttonClasses } from '../utils/buttonStyles.js';
import Spinner from './Spinner.jsx';

// While `loading` is true the button is disabled and shows `loadingLabel`
// (e.g. "Creating..."), which also prevents duplicate submissions.
export default function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  loadingLabel,
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={buttonClasses(variant)}
      {...props}
    >
      {loading && <Spinner />}
      {loading ? loadingLabel : children}
    </button>
  );
}
