const Footer = ({ teamMembers, classInfo, studentYear, courseName, year }) => {
  return (
    <footer className="site-footer">
      <div>
        <h2>ShopHub</h2>
        <p>Copyright {year} ShopHub. All rights reserved.</p>
      </div>

      <div className="footer-info">
        <p>
          <strong>Class:</strong> {classInfo}
        </p>
        <p>
          <strong>Student year:</strong> {studentYear}
        </p>
        <p>
          <strong>Course:</strong> {courseName}
        </p>
      </div>

      <div>
        <h3>Team Members</h3>
        <ul className="team-list">
          {teamMembers.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
