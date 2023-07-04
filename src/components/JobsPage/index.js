import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill, BsSearch} from 'react-icons/bs'
import {Component} from 'react'

import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiProfileConstants = {
  profileResponseInitial: 'PROFILE_RESPONSE_INITIAL',
  profileResponseSuccess: 'PROFILE_RESPONSE_SUCCESS',
  profileResponseFailure: 'PROFILE_RESPONSE_FAILURE',
}

const apiJobConstants = {
  jobsResponseInitial: 'JOBS_RESPONSE_INITIAL',
  jobsResponseSuccess: 'JOBS_RESPONSE_SUCCESS',
  jobsResponseFailure: 'JOBS_RESPONSE_FAILURE',
}

class JobsPage extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    apiProfileResponseStatus: apiProfileConstants.profileResponseInitial,
    apiJobsResponseStatus: apiJobConstants.jobsResponseInitial,
    inputValue: '',
    searchValue: '',
    employmentType: [],
    packageValue: '',
  }

  componentDidMount() {
    this.getUserProfileData()
  }

  getUserProfileData = async () => {
    const {employmentType, searchValue, packageValue} = this.state
    const employmentTypeValues =
      employmentType === [] ? '' : employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeValues}&minimum_package=${packageValue}&search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(profileUrl, options)
    const jobsResponse = await fetch(jobsUrl, options)

    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        apiProfileResponseStatus: apiProfileConstants.profileResponseSuccess,
      })
    } else {
      this.setState({
        apiProfileResponseStatus: apiProfileConstants.profileResponseFailure,
      })
    }

    if (jobsResponse.ok) {
      const jobsListData = await jobsResponse.json()
      const updatedJobsListData = jobsListData.jobs.map(jobDetails => ({
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }))
      this.setState({
        jobsList: updatedJobsListData,
        apiJobsResponseStatus: apiJobConstants.jobsResponseSuccess,
      })
    } else {
      this.setState({
        apiJobsResponseStatus: apiJobConstants.jobsResponseFailure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState(
      {
        inputValue: event.target.value,
      },
      this.getUserProfileData,
    )
  }

  onClickCheckbox = event => {
    const {employmentType} = this.state
    let updatedEmploymentTypeData
    if (employmentType.includes(event.target.value)) {
      updatedEmploymentTypeData = employmentType.filter(
        each => each !== event.target.value,
      )
    } else {
      updatedEmploymentTypeData = [...employmentType, event.target.value]
    }
    this.setState(
      {
        employmentType: updatedEmploymentTypeData,
      },
      this.getUserProfileData,
    )
  }

  onChangeRadioInput = event => {
    this.setState(
      {
        packageValue: event.target.value,
      },
      this.getUserProfileData,
    )
  }

  onClickSearchButton = () => {
    const {inputValue} = this.state
    this.setState(
      {
        searchValue: inputValue,
      },
      this.getUserProfileData,
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  onClickRetryButton = () => {
    this.setState(
      {
        apiProfileResponseStatus: apiProfileConstants.profileResponseInitial,
        apiJobsResponseStatus: apiJobConstants.jobsResponseInitial,
      },
      this.getUserProfileData,
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobsNoData = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">No Jobs Found</h1>
      <p className="jobs-failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <>
        <ul className="unordered-lists">
          {jobsList.map(eachItem => (
            <li key={eachItem.id} className="job-list-item">
              <Link to={`/jobs/${eachItem.id}`} className="link">
                <div className="job-details-container">
                  <img
                    src={eachItem.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div>
                    <h1 className="job-title">{eachItem.title}</h1>
                    <div className="rating-container">
                      <AiFillStar className="star-icon" />
                      <p className="rating">{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="job-location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{eachItem.location}</p>
                  <BsFillBriefcaseFill className="briefcase-icon" />
                  <p className="employment-type">{eachItem.employmentType}</p>
                  <p className="package-per-annum">
                    {eachItem.packagePerAnnum}
                  </p>
                </div>
                <h1 className="description-heading">Description</h1>
                <p className="description">{eachItem.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderJobsNoData()
    }
    return this.renderJobsList()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {
      inputValue,
      apiProfileResponseStatus,
      apiJobsResponseStatus,
    } = this.state

    let userProfile
    switch (apiProfileResponseStatus) {
      case apiProfileConstants.profileResponseInitial:
        userProfile = this.renderLoadingView()
        break
      case apiProfileConstants.profileResponseSuccess:
        userProfile = this.renderProfileSuccessView()
        break
      case apiProfileConstants.profileResponseFailure:
        userProfile = this.renderProfileFailureView()
        break
      default:
        userProfile = null
    }

    let jobDetails
    switch (apiJobsResponseStatus) {
      case apiJobConstants.jobsResponseInitial:
        jobDetails = this.renderLoadingView()
        break
      case apiJobConstants.jobsResponseSuccess:
        jobDetails = this.renderJobsSuccessView()
        break
      case apiJobConstants.jobsResponseFailure:
        jobDetails = this.renderJobsFailureView()
        break
      default:
        jobDetails = null
    }

    return (
      <div className="jobs-bg-container">
        <Header />

        <div className="jobs-container">
          <div className="search-container search-container-sm">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              onChange={this.onChangeSearchInput}
              value={inputValue}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.onClickSearchButton}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="profile-container-lg">
            {userProfile}
            <hr className="horizontal-line" />
            <h1 className="unordered-list-heading">Type of Employment</h1>
            <ul className="unordered-lists">
              {employmentTypesList.map(eachItem => (
                <li key={eachItem.label} className="list-item">
                  <input
                    type="checkbox"
                    id="checkbox"
                    onClick={this.onClickCheckbox}
                    value={eachItem.employmentTypeId}
                  />
                  <label htmlFor="checkbox" className="list-item-label">
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="horizontal-line" />
            <h1 className="unordered-list-heading">Salary Range</h1>
            <ul className="unordered-lists">
              {salaryRangesList.map(eachItem => (
                <li key={eachItem.label} className="list-item">
                  <input
                    type="radio"
                    id="radio"
                    value={eachItem.salaryRangeId}
                    onChange={this.onChangeRadioInput}
                  />
                  <label htmlFor="radio" className="list-item-label">
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="search-container search-container-lg">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                value={inputValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {jobDetails}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return this.renderJobDetailsView()
  }
}
export default JobsPage
