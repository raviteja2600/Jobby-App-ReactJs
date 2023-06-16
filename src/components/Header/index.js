import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav>
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-website-logo"
          />
        </Link>
        <ul className="header-icons-container">
          <Link to="/">
            <li>
              <AiFillHome className="icon" />
            </li>
          </Link>
          <Link to="/jobs">
            <li>
              <BsFillBriefcaseFill className="icon" />
            </li>
          </Link>
          <li>
            <FiLogOut className="icon" />
          </li>
        </ul>
        <div className="options-container">
          <Link to="/" className="link">
            <p className="option home">Home</p>
          </Link>
          <Link to="/jobs" className="link">
            <p className="option">Jobs</p>
          </Link>
        </div>
        <button
          type="button"
          className="logout-button"
          onClick={onClickLogoutButton}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
