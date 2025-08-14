import React from 'react';

const AppCard = () => {
    return (
        <div className="card-wrapper">
          <div className="card wallet gradient">
            <div className="overlay" />
            <div className="circle">
              <svg width="120px" height="92px" viewBox="23 29 78 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="icon" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" transform="translate(23.000000, 29.500000)">
                  <rect fill="#FFA725" x="67.84" y="26.03" width="9.4" height="21.88" rx="4.7" />
                  <rect fill="#FF8C00" x="67.84" y="38.78" width="9.4" height="10.96" rx="4.7" />
                  <polygon fill="#FF8C00" points="57.31 0 67.16 26.38 14.44 45.07 4.59 18.69" />
                  <path d="M0,19.61 C0,16.29 2.69,13.60 6.00,13.60 L67.64,13.60 C70.95,13.60 73.64,16.29 73.64,19.61 L73.64,52.66 C73.64,55.98 70.95,58.67 67.64,58.67 L6.00,58.67 C2.69,58.67 0,55.98 0,52.66 Z" fill="#FFC876" />
                  <path d="M47.52,27.08 C45.01,24.54 40.93,24.54 38.42,27.08 L36.91,28.62 L35.39,27.08 C32.88,24.54 28.81,24.54 26.30,27.08 C23.79,29.63 23.79,33.76 26.30,36.30 L36.91,47.05 L47.52,36.30 C50.03,33.76 50.03,29.63 47.52,27.08" fill="#FFF5E4" />
                  <rect fill="#FFA725" x="58.03" y="26.12" width="15.61" height="12.86" />
                  <ellipse fill="#FFFFFF" cx="65.83" cy="33.09" rx="2.20" ry="2.23" />
                </g>
              </svg>
            </div>
            <p className="text-center font-rouge text-6xl">Download our app for easy access</p>
            <a href="https://play.google.com/store" className="download-btn" target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
          
          <style jsx>{`
            .card-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              padding: 20px;
            }
            
            /* Orange-yellow theme variables */
            .wallet.gradient {
              --bg-color: linear-gradient(135deg, #FFA725, #FF8C00);
              --bg-color-light: linear-gradient(135deg, #FFC876, #FFA725);
              --text-color-hover: #FFF5E4;
              --box-shadow-color: rgba(255, 167, 37, 0.4);
            }
            
            .card {
              width: 360px;
              height: 520px;
              background: linear-gradient(135deg, #FFF5E4, #FFE4B5);
              border-radius: 20px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              position: relative;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease-out;
              text-decoration: none;
              padding: 30px;
            }
            
            .card:hover {
              transform: translateY(-8px) scale(1.01);
              box-shadow:
                0 30px 50px rgba(0, 0, 0, 0.15),
                0 30px 60px var(--box-shadow-color);
            }
            
            .card:hover .overlay {
              transform: scale(4);
            }
            
            .card:hover .circle {
              border-color: var(--bg-color-light);
              background: var(--bg-color);
            }
            
            .card:hover .circle:after {
              background: var(--bg-color-light);
            }
            
            .card:hover p {
              color: var(--text-color-hover);
            }
            
            .card p {
              font-size: 24px;
              color: #6A9C89;
              margin-top: 40px;
              z-index: 1000;
              transition: color 0.3s ease-out;
              text-align: center;
            }
            
            .circle {
              width: 200px;
              height: 200px;
              border-radius: 50%;
              background: #FFF5E4;
              border: 4px solid var(--bg-color);
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              z-index: 1;
              transition: all 0.3s ease-out;
            }
            
            .circle:after {
              content: "";
              width: 180px;
              height: 180px;
              display: block;
              position: absolute;
              background: var(--bg-color);
              border-radius: 50%;
              top: 10px;
              left: 10px;
              transition: opacity 0.3s ease-out;
            }
            
            .circle svg {
              z-index: 10000;
            }
            
            .overlay {
              width: 180px;
              height: 180px;
              border-radius: 50%;
              background: var(--bg-color);
              position: absolute;
              top: 120px;
              left: 90px;
              z-index: 0;
              transition: transform 0.3s ease-out;
            }
      
            .download-btn {
              background: #FFA725;
              color: #FFF5E4;
              padding: 16px 32px;
              border-radius: 30px;
              text-decoration: none;
              font-size: 18px;
              font-weight: 600;
              margin-top: 30px;
              transition: all 0.3s ease;
              box-shadow: 0 8px 15px rgba(255, 167, 37, 0.3);
              z-index: 1000;
            }
            
            .download-btn:hover {
              background: #FF8C00;
              transform: translateY(-3px);
              box-shadow: 0 10px 20px rgba(255, 167, 37, 0.4);
            }
          `}</style>
        </div>
      );
}

export default AppCard;