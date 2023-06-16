import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsPage extends Component {
  state = {
    jobDetailsData: {},
    similarJobsData: [],
    skillsList: [],
    lifeAtCompanyData: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedLifeAtCompanyData = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const updatedSimilarJobsData = data.similar_jobs.map(jobDetails => ({
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }))
      const updatedSkillsList = data.job_details.skills.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({
        jobDetailsData: updatedJobDetailsData,
        similarJobsData: updatedSimilarJobsData,
        skillsList: updatedSkillsList,
        lifeAtCompanyData: updatedLifeAtCompanyData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  renderJobItemDetails = () => {
    const {
      jobDetailsData,
      skillsList,
      lifeAtCompanyData,
      similarJobsData,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsData
    const {description, imageUrl} = lifeAtCompanyData
    return (
      <div className="job-details-bg-container">
        <div className="job-details-card-container">
          <div className="job-details-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div>
              <h1 className="job-details-company-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-location-container">
            <MdLocationOn className="location-icon" />
            <p className="job-details-location">{location}</p>
            <BsFillBriefcaseFill className="briefcase-icon" />
            <p className="job-details-employment-type">{employmentType}</p>
            <p className="job-details-package">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="card-bottom-section">
            <div className="description-visit-container">
              <h1 className="sub-heading">Description</h1>
              <a href={companyWebsiteUrl} className="visit">
                Visit
                <span className="visit-icon">
                  <BiLinkExternal />
                </span>
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1 className="sub-heading">Skills</h1>
            <ul className="skill-lists">
              {skillsList.map(eachItem => (
                <li key={eachItem.name} className="skills-list-item">
                  <img
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="sub-heading">Life At Company</h1>
            <div className="description-image-container">
              <p className="job-description">{description}</p>
              <img
                src={imageUrl}
                alt="life at company"
                className="company-image"
              />
            </div>
          </div>
        </div>
        <h1 className="similar-jobs">Similar Jobs</h1>
        <ul className="similar-job-lists">
          {similarJobsData.map(jobDetails => (
            <li className="similar-job-list" key={jobDetails.id}>
              <div className="job-details-container">
                <img
                  src={jobDetails.companyLogoUrl}
                  alt="similar job company logo"
                  className="job-details-company-logo"
                />
                <div>
                  <h1 className="job-details-company-title">
                    {jobDetails.title}
                  </h1>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{jobDetails.rating}</p>
                  </div>
                </div>
              </div>
              <div className="description-container">
                <h1 className="sub-heading">Description</h1>
                <p className="job-description">{jobDetails.jobDescription}</p>
              </div>
              <div className="job-details-location-container">
                <MdLocationOn className="location-icon" />
                <p className="job-details-location">{jobDetails.location}</p>
                <BsFillBriefcaseFill className="briefcase-icon" />
                <p className="job-details-employment-type">
                  {jobDetails.employmentType}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickRetryButton = () => {
    this.setState(
      {
        apiStatus: apiConstants.inProgress,
      },
      this.getJobDetails,
    )
  }

  renderJobItemFailureView = () => (
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

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    let jobItemDetails
    switch (apiStatus) {
      case apiConstants.inProgress:
        jobItemDetails = this.renderLoadingView()
        break
      case apiConstants.success:
        jobItemDetails = this.renderJobItemDetails()
        break
      case apiConstants.failure:
        jobItemDetails = this.renderJobItemFailureView()
        break
      default:
        jobItemDetails = null
    }

    return (
      <div className="job-details-bg-container">
        <Header />
        {jobItemDetails}
      </div>
    )
  }
}
export default JobItemDetailsPage
