import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Button } from "reactstrap";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

interface BlogProps {
  image?: string;
  title: string;
  subtitle?: string;
  text: string;
  color?: string;
  defaultImage: any;
  blog: {
    _id: string;
    comments: any[];
    likes: any[];
  };
}

const Blog: React.FC<BlogProps> = ({ image, title, subtitle, text, color, defaultImage, blog }) => {
  function getFirst84Characters(paragraph: string | undefined) {
    // Use substring to get the first 84 characters
    const first84Characters = paragraph?.substring(0, 74);
    return first84Characters;
  }

  function getHeadingCharacters(heading: string | undefined) {
    // Use substring to get the first 84 characters
    const first84Characters = heading?.substring(0, 34);
    return first84Characters;
  }

  return (
    <Card className="max-h-[35rem]">
      <Image alt="Card image cap" src={image || defaultImage} />
      <CardBody className="p-4">
        <CardTitle tag="h5" className="font-bold">{getHeadingCharacters(title)}...</CardTitle>
        <div className="flex justify-between items-center">
          <span>Comments: {blog?.comments.length || 0}</span>
          <span>Likes: {blog?.likes.length || 0}</span>
        </div>
        <CardText className="mt-3">{getFirst84Characters(text)}...</CardText>
        <Link href={`/blog/${blog._id}`}>
          <Button color={color} className="mt-5">Read More</Button>
        </Link>
      </CardBody>
    </Card>
  );
};

Blog.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.any,
  subtitle: PropTypes.string,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  defaultImage: PropTypes.string.isRequired,
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired, // You might want to replace 'array' with an appropriate type
    likes: PropTypes.array.isRequired, // You might want to replace 'array' with an appropriate type
  }).isRequired,
};

export default Blog;
