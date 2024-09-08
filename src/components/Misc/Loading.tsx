import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <div className='text-center' style={{fontSize: "15vw"}} >
        <Spinner animation="border" variant="danger"/>
    </div>
  )
}

export default Loading