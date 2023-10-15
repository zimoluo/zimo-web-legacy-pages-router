import React from "react";
import AboutQuestion from "./AboutQuestion";
import { lightBgColorMap } from "@/interfaces/themeMaps";

type Props = {
  questions: string[];
  descriptions: string[];
};

const AboutQuestionList: React.FC<Props> = ({ questions, descriptions }) => {
  // Ensure descriptions array is the same length as questions array
  const processedDescriptions = [...descriptions];
  while (processedDescriptions.length < questions.length) {
    processedDescriptions.push("");
  }
  processedDescriptions.length = questions.length;

  return (
    <>
      <p className="py-4 font-bold text-xl">If you have questions...</p>
      {questions.map((question, index) => (
        <AboutQuestion
          key={index}
          question={question}
          description={processedDescriptions[index]}
          index={index}
        />
      ))}
    </>
  );
};

export default AboutQuestionList;
