"use client"

import { useState, useEffect } from "react"
import "./TripPage.css"

function TripPage({ trip }) {
  const [activeTab, setActiveTab] = useState("expenses")
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitWith: [],
  })

  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [totals, setTotals] = useState({})
  const [photos, setPhotos] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [photoDescription, setPhotoDescription] = useState("")

  const tripName = trip?.tripName || "My Trip"
  const members = trip?.members || ["You", "Friend 1", "Friend 2"]

  useEffect(() => {
    function handleClickOutside(event) {
      if (showExpenseForm && !event.target.closest(".expense-form-popup")) {
        setShowExpenseForm(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showExpenseForm])

  const handleCheckboxChange = (member) => {
    setExpenseForm((prevForm) => {
      const alreadySelected = prevForm.splitWith.includes(member)
      const newSplitWith = alreadySelected
        ? prevForm.splitWith.filter((m) => m !== member)
        : [...prevForm.splitWith, member]
      return { ...prevForm, splitWith: newSplitWith }
    })
  }

  const calculateBalance = (expense) => {
    const { amount, paidBy, splitWith, title } = expense
    const amt = Number.parseFloat(amount)
    const share = amt / splitWith.length
    const summary = []
    const newTotals = { ...totals }

    splitWith.forEach((member) => {
      if (member !== paidBy) {
        summary.push(`${member} is baaki ₹${share.toFixed(2)} to ${paidBy} for ${title}`)

        if (!newTotals[member]) newTotals[member] = {}
        if (!newTotals[member][paidBy]) newTotals[member][paidBy] = 0

        newTotals[member][paidBy] += share
      }
    })

    setTotals(newTotals)
    return summary
  }

  const handleAddExpense = () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.paidBy || expenseForm.splitWith.length === 0) {
      alert("Please fill in all fields")
      return
    }

    const newExpense = {
      ...expenseForm,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    }

    setExpenses([newExpense, ...expenses])

    const newBalanceEntry = {
      expense: expenseForm.title,
      amount: expenseForm.amount,
      summary: calculateBalance(expenseForm),
    }

    setBalances([newBalanceEntry, ...balances])
    setExpenseForm({ title: "", amount: "", paidBy: "", splitWith: [] })
    setShowExpenseForm(false)
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUploadPhoto = () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    const fileURL = URL.createObjectURL(selectedFile)
    const newPhoto = {
      id: Date.now(),
      url: fileURL,
      name: selectedFile.name,
      uploadedBy: members[0], // Assuming first member is current user
      date: new Date().toLocaleDateString(),
      description: photoDescription, 
    }

    setPhotos([newPhoto, ...photos])
    setSelectedFile(null)
    setPhotoDescription("") // Reset description after upload

    const fileInput = document.getElementById("photo-upload")
    if (fileInput) fileInput.value = ""
  }

  return (
    <div className="trip-page">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="trip-content">
        <div className="trip-header">
          <h1 className="trip-title">{tripName}</h1>
          <div className="trip-dates">
            {trip?.startDate && trip?.endDate ? (
              <span>
                {trip.startDate} - {trip.endDate}
              </span>
            ) : (
              <span>Your awesome adventure</span>
            )}
          </div>
          <div className="trip-members">
            <span>Members: </span>
            {members.map((member, index) => (
              <span key={index} className="member-tag">
                {member}
              </span>
            ))}
          </div>
        </div>

        <div className="tabs">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`tab-button ${activeTab === "expenses" ? "active" : ""}`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("balances")}
            className={`tab-button ${activeTab === "balances" ? "active" : ""}`}
          >
            Balances
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`tab-button ${activeTab === "photos" ? "active" : ""}`}
          >
            Photos
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "expenses" && (
            <div className="expenses-container">
              <button onClick={() => setShowExpenseForm(true)} className="new-expense-btn">
                + New Expense
              </button>

              {expenses.length === 0 ? (
                <div className="empty-state">
                  <p>No expenses yet. Add your first expense!</p>
                </div>
              ) : (
                <div className="expense-list">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="expense-card">
                      <div className="expense-header">
                        <h3>{expense.title}</h3>
                        <span className="expense-amount">₹{expense.amount}</span>
                      </div>
                      <div className="expense-details">
                        <p>
                          Paid by: <span className="highlight">{expense.paidBy}</span>
                        </p>
                        <p>Split with: {expense.splitWith.join(", ")}</p>
                        <p className="expense-date">{expense.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showExpenseForm && (
                <div className="popup-overlay">
                  <div className="expense-form-popup">
                    <h3 className="popup-title">Add New Expense</h3>
                    <div className="expense-form">
                      <div className="form-group">
                        <label htmlFor="expense-title">What is the expense for?</label>
                        <input
                          id="expense-title"
                          type="text"
                          placeholder="e.g. Dinner, Taxi, Hotel"
                          value={expenseForm.title}
                          onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                          className="expense-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="expense-amount">Amount</label>
                        <input
                          id="expense-amount"
                          type="number"
                          placeholder="₹"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          className="expense-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="paid-by">Paid by</label> 
                        <select
                          id="paid-by"
                          value={expenseForm.paidBy}
                          onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                          className="expense-input"
                        >
                          <option value="">Select who paid</option> 
                          {members.map((member, index) => (
                            <option key={index} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Split with</label>
                        <div className="checkbox-group">
                          {members.map((member, index) => (
                            <label key={index} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={expenseForm.splitWith.includes(member)}
                                onChange={() => handleCheckboxChange(member)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-text">{member}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="button-container">
                        <button className="cancel-btn" onClick={() => setShowExpenseForm(false)}>
                          Cancel
                        </button>
                        <button className="add-expense-btn" onClick={handleAddExpense}>
                          Save Expense
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "balances" && (
            <div className="balances-container">
              {balances.length === 0 ? (
                <div className="empty-state">
                  <p>No balances yet. Add expenses to see who owes what.</p>
                </div>
              ) : (
                <>
                  <div className="totals-section">
                    <h3 className="section-title">Summary</h3>
                    {Object.keys(totals).length === 0 ? (
                      <p>No outstanding balances</p>
                    ) : (
                      <ul className="total-items">
                        {Object.keys(totals).map((from) =>
                          Object.keys(totals[from]).map((to) =>
                            totals[from][to] > 0 ? (
                              <li key={`${from}-${to}`} className="balance-item">
                                <span className="member-name">{from}</span> is baaki
                                <span className="balance-amount"> ₹{totals[from][to].toFixed(2)}</span> to
                                <span className="member-name"> {to}</span>
                              </li>
                            ) : null,
                          ),
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="balance-history">
                    <h3 className="section-title">Expense History</h3>
                    {balances.map((entry, idx) => (
                      <div key={idx} className="balance-entry">
                        <div className="balance-header">
                          <h4>{entry.expense}</h4>
                          <span className="balance-amount">₹{entry.amount}</span>
                        </div>
                        <ul className="balance-summary">
                          {entry.summary.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="photos-container">
              <div className="photo-upload-section">
                <h3 className="section-title">Share Your Memories</h3>
                <div className="upload-controls">
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <label htmlFor="photo-upload" className="file-label">
                      {selectedFile ? selectedFile.name : "Choose a file"}
                    </label>
                  </div>
                  <button onClick={handleUploadPhoto} className="upload-btn" disabled={!selectedFile}>
                    Upload Photo
                  </button>
                </div>
                {/* Added description input field */}
                <div className="description-input-container">
                  <label htmlFor="photo-description" className="description-label">
                    Photo Description (optional)
                  </label>
                  <textarea
                    id="photo-description"
                    placeholder="Add a description for your photo..."
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    className="description-input"
                  />
                </div>
              </div>

              {photos.length === 0 ? (
                <div className="empty-state">
                  <p>No photos yet. Upload your trip memories!</p>
                </div>
              ) : (
                <div className="photo-gallery">
                  {photos.map((photo) => (
                    <div key={photo.id} className="photo-card">
                      <img src={photo.url || "/placeholder.svg"} alt={photo.name} className="trip-photo" />
                      <div className="photo-info">
                        <p className="photo-name">{photo.name}</p>
                        {photo.description && <p className="photo-description">{photo.description}</p>}
                        <p className="photo-uploader">Uploaded by: {photo.uploadedBy}</p>
                        <p className="photo-date">{photo.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripPage