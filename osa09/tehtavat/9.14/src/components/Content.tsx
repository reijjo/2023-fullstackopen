import { CoursePart } from "../App";
import Part from "./Part";

type Props = {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: Props) => {
  return <Part courseParts={courseParts} />;
};

export default Content;
