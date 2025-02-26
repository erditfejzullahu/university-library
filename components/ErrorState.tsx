import React from 'react'

const ErrorState = () => {
  return (
    <div className="bg-white rounded-lg self-start h-fit flex-1">
        <div className="border-2 border-red rounded-lg flex flex-col items-center justify-center max-w-xl mx-auto p-6">
            <h2 className="text-lg text-black font-ibm-plex-sans font-semibold">Dicka shkoi gabim</h2>
            <p className="text-black font-ibm-plex-sans text-sm mt-6">Ju lutem provoni perseri apo kontaktoni administratorin.</p>
        </div>
    </div>
  )
}

export default ErrorState