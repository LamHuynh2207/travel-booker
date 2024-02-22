import { getApiDocs } from '../libs/swagger';
import ReactSwagger from './react-swagger';

export default async function ApiDocs() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}