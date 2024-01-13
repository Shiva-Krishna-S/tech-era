import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.courses.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        logoUrl: eachItem.logo_url,
      }))
      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {coursesList} = this.state
    return (
      <div className="success-view-container">
        <div className="content-container">
          <h1 className="courses-title">Courses</h1>
          <ul className="courses-list-container">
            {coursesList.map(eachCourse => (
              <li key={eachCourse.id} className="course-item">
                <Link
                  to={`/courses/${eachCourse.id}`}
                  className="course-item-container"
                >
                  <img
                    src={eachCourse.logoUrl}
                    alt={eachCourse.name}
                    className="course-image"
                  />
                  <p className="course-name">{eachCourse.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.getCoursesList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-message">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onRetry} className="failure-button">
        Retry
      </button>
    </div>
  )

  renderPageViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderPageViews()}
      </>
    )
  }
}

export default Home
