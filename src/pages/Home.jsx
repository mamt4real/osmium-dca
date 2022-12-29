import React from 'react'
import './css/Home.css'
import LoginForm from '../components/LoginForm'

function Home() {
  return (
    <div className='home' id='home'>
      <section className='left home__text'>
        <LoginForm />
      </section>
    </div>
  )
}

export default Home
