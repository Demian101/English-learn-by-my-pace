import UploadWord from '../upload/UploadWord';
import UploadExtension from '../upload/UploadExtension';
import UploadSentence from '../upload/UploadSentence';

const UploadPage = () => {
  return(
    <div className="grid grid-cols-2 gap-2 p-6">
      <UploadWord />
      <UploadExtension />
      <UploadSentence />
    </div>
  )
}
export default UploadPage;