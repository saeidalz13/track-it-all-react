import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <div className='text-center' style={{fontSize: "20vw"}} >
        <Spinner animation="border" variant="info"/>
    </div>
  )
}

export default Loading