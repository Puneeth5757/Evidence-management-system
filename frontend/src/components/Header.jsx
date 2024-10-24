import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Evidence Management</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* Added ms-auto to push links to the end */}
            <li className="nav-item">
              <Link className="nav-link" to="/add-evidence">Add Evidence</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fetch-evidence">Fetch Evidence</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
