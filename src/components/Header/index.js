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
          <li>
            <Link to="/">
              <AiFillHome className="icon" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsFillBriefcaseFill className="icon" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={onClickLogoutButton}
              className="logout-icon"
            >
              <FiLogOut className="icon" />
            </button>
          </li>
        </ul>
        <ul className="options-container">
          <li>
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link">
              Jobs
            </Link>
          </li>
        </ul>
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
