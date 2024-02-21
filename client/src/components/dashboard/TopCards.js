import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { ColorRing } from 'react-loader-spinner';

const TopCards = ({ bg, icon, earning, subtitle, title, loading }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <div className={`circle-box lg-box d-inline-block ${bg}`}>
            <i className={icon} />
          </div>
          <div className="ms-3">
            <h3 className="mb-0 font-weight-bold">{loading ? <ColorRing
              visible={true}
              height="20"
              width="20"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            /> : earning}</h3>
            <small className="text-muted">{subtitle}</small>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

TopCards.propTypes = {
  bg: PropTypes.string,
  icon: PropTypes.string,
  earning: PropTypes.number,
  subtitle: PropTypes.string,
  loading: PropTypes.bool
};

export default TopCards;
