import { CoursePart } from "../App";

type Props = {
  courseParts: CoursePart[];
};

const Part = ({ courseParts }: Props) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  return (
    <div>
      {courseParts.map((part, index) => {
        switch (part.kind) {
          case "basic":
            return (
              <div key={index}>
                <h3 style={{ marginBottom: "2px" }}>
                  {part.name} {part.exerciseCount}
                </h3>
                <i>{part.description}</i>
              </div>
            );
          case "group":
            return (
              <div key={index}>
                <h3 style={{ marginBottom: "2px" }}>
                  {part.name} {part.exerciseCount}
                </h3>
                project exercises {part.groupProjectCount}
              </div>
            );
          case "background":
            return (
              <div key={index}>
                <h3 style={{ marginBottom: "2px" }}>
                  {part.name} {part.exerciseCount}
                </h3>
                <i>{part.description}</i>
                <p style={{ marginTop: "2px" }}>
                  submit to {part.backgroundMaterial}
                </p>
              </div>
            );
          case "special":
            return (
              <div key={index}>
                <h3 style={{ marginBottom: "2px" }}>
                  {part.name} {part.exerciseCount}
                </h3>
                <i>{part.description}</i>
                <p style={{ marginTop: "2px" }}>
                  required skills: {part.requirements.join(", ")}
                </p>
              </div>
            );
          default:
            return assertNever(part);
        }
      })}
    </div>
  );
  // courseParts.forEach((part) => {
  //   switch (part.kind) {
  //     case "basic":
  //       return (
  //         <>
  //           <h3>
  //             {part.name} {part.exerciseCount}
  //           </h3>
  //           <p>{part.description}</p>
  //         </>
  //       );
  //     case "group":
  //       return (
  //         <>
  //           <h3>
  //             {part.name} {part.exerciseCount}
  //           </h3>
  //         </>
  //       );
  //     case "background":
  //       return (
  //         <>
  //           <h3>
  //             {part.name} {part.exerciseCount}
  //           </h3>
  //         </>
  //       );
  //     default:
  //       return assertNever(part);
  //   }
  // });
};

export default Part;
