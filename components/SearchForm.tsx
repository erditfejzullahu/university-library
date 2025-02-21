import { Input } from './ui/input'
import Form from "next/form"
import { Search } from 'lucide-react'

const SearchForm = ({query}: {query? : string}) => {  
  return (
    <form action={"/search"} method="GET" className="max-w-2xl mx-auto mb-20 search-form">
      <div className="relative">
        <Input 
          type='text'
          name='query'
          defaultValue={query}
          className="text-white font-ibm-plex-sans !pl-10 text-base bg-dark-300 border-0 rounded-lg py-6" 
          placeholder='Kerkoni librin tuaj te preferuar'
          />
        <button type='submit' className="absolute top-0 left-2 bottom-0">
          <Search className="text-white"/>
        </button>
      </div>
    </form>
  )
}

export default SearchForm