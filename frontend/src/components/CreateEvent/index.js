import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

function CreateEvent() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [name, setName] = useState('');
  const [type, setType] = useState(undefined)
  const [privacy, setPrivacy] = useState(undefined)
  const [price, setPrice] = useState('')
  

  return (
    <div>CreateEvent</div>
  )
}

export default CreateEvent
