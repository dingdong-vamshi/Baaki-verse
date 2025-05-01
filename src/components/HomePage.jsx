"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./HomePage.css"

function HomePage({ user, onCreateTrip }) {
  const [showForm, setShowForm] = useState(false)
  const [tripName, setTripName] = useState("")
  const [members, setMembers] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (showForm && !event.target.closest(".trip-form-popup")) {
        setShowForm(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showForm])

  const handleCreate = () => {
    if (!tripName || !members || !startDate || !endDate) {
      alert("Please fill in all fields")
      return
    }

    const membersArray = members.split(",").map((member) => member.trim())

    onCreateTrip({
      tripName,
      members: membersArray,
      startDate,
      endDate,
    })

    navigate("/trip")
  }

  return (
    <div className="homepage">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="homepage-overlay">
        <h2 className="welcome-text">Hello {user?.username || "Traveler"} 👋</h2>
        <p className="subtitle">Ready for your next adventure?</p>
        <button onClick={() => setShowForm(true)} className="create-trip-btn">
          + New Trip
        </button>

        {showForm && (
          <div className="popup-overlay">
            <div className="trip-form-popup">
              <h3 className="popup-title">Create New Trip</h3>
              <div className="trip-form">
                <div className="form-group">
                  <label htmlFor="tripName">Trip Name</label>
                  <input
                    id="tripName"
                    className="trip-input"
                    placeholder="e.g. Goa Weekend"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="members">Trip Members</label>
                  <input
                    id="members"
                    className="trip-input"
                    placeholder="YourName,Names separated by commas"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                  />
                </div>

                <div className="date-container">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      id="startDate"
                      className="trip-input"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      id="endDate"
                      className="trip-input"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="button-container">
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="submit-trip-btn" onClick={handleCreate}>
                    Create Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage