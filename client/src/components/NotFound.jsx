import { IMAGE_404_URL } from "../constants";

export default function NotFound() {

    return (
      <div className='notFoundErrPage'>
        <img id='img404' src={IMAGE_404_URL} alt="404 Page Not Found Error"/>
      </div>
    )
  }