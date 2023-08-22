import './Footer.css'

function Footer() {
  return (
    <div className='footer-container'>
        <div className='footer-content'>
            <h3 className='footer-header'>Created With:</h3>
            <div className='footer-tech'>
                <p>React</p>
                <p>Redux</p>
                <p>Express</p>
                <p>Node</p>
                <p>Postgres</p>
            </div>
            <div className='footer-about_me'>
                <p>Find out more about me</p>
                <div className='footer-links'>
                    <a href=''><i className="fa-solid fa-laptop"></i></a>
                    <a href='https://www.github.com/cathalpaz'><i className="fa-brands fa-github"></i></a>
                    <a href='https://www.linkedin.com/in/cathal-paz-052239263/'><i className="fa-brands fa-linkedin"></i></a>
                </div>
            </div>
            <p className='footer-tag'>© Cathal Paz</p>

        </div>
    </div>
  )
}

export default Footer
