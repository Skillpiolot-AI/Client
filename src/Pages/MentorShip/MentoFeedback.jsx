// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../config';
// import { useAuth } from '../../AuthContext';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// const MentorFeedback = ({ mentorId }) => {
//   const [feedback, setFeedback] = useState([]);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user && (user.role === 'Mentor' || user.role === 'Admin') && mentorId) {
//       fetchFeedback(mentorId);
//     } else if (!mentorId) {
//       setError('Mentor ID is missing');
//     } else {
//       setError('User is not authorized to view this feedback');
//     }
//   }, [user, mentorId]);

//   const fetchFeedback = async (mentorId) => {
//     try {
//       const response = await axios.get(`${config.API_BASE_URL}/mentor-feedback/${mentorId}`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setFeedback(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching feedback:', error);
//       setError(`Failed to fetch feedback: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   if (error) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }

//   const calculateAverageRating = (field) => {
//     const sum = feedback.reduce((acc, curr) => acc + curr.rating[field], 0);
//     return (sum / feedback.length).toFixed(1);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Mentor Feedback</h2>
//       {feedback.length === 0 ? (
//         <p className="text-gray-500">No feedback found.</p>
//       ) : (
//         <>
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Average Ratings</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Communication Skills: {calculateAverageRating('communicationSkills')}</p>
//               <p>Clarity of Guidance: {calculateAverageRating('clarityOfGuidance')}</p>
//               <p>Learning Outcomes: {calculateAverageRating('learningOutcomes')}</p>
//               <p>Frequency and Quality of Meetings: {calculateAverageRating('frequencyAndQualityOfMeetings')}</p>
//             </CardContent>
//           </Card>
//           <Accordion type="single" collapsible>
//             {feedback.map((item, index) => (
//               <AccordionItem key={item._id} value={`item-${index}`}>
//                 <AccordionTrigger>Feedback from {item.userId.name}</AccordionTrigger>
//                 <AccordionContent>
//                   <p>Communication Skills: {item.rating.communicationSkills}</p>
//                   <p>Clarity of Guidance: {item.rating.clarityOfGuidance}</p>
//                   <p>Learning Outcomes: {item.rating.learningOutcomes}</p>
//                   <p>Frequency and Quality of Meetings: {item.rating.frequencyAndQualityOfMeetings}</p>
//                   <p>Remarks: {item.rating.remarks}</p>
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </>
//       )}
//     </div>
//   );
// };

// export default MentorFeedback;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const MentorFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/all-feedback`);
      setFeedback(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError(`Failed to fetch feedback: ${error.response?.data?.message || error.message}`);
    }
  };

  const calculateAverageRating = (feedbackList) => {
    const sum = feedbackList.reduce((acc, curr) => ({
      communicationSkills: acc.communicationSkills + curr.rating.communicationSkills,
      clarityOfGuidance: acc.clarityOfGuidance + curr.rating.clarityOfGuidance,
      learningOutcomes: acc.learningOutcomes + curr.rating.learningOutcomes,
      frequencyAndQualityOfMeetings: acc.frequencyAndQualityOfMeetings + curr.rating.frequencyAndQualityOfMeetings
    }), {
      communicationSkills: 0,
      clarityOfGuidance: 0,
      learningOutcomes: 0,
      frequencyAndQualityOfMeetings: 0
    });

    const count = feedbackList.length;
    return {
      communicationSkills: (sum.communicationSkills / count).toFixed(1),
      clarityOfGuidance: (sum.clarityOfGuidance / count).toFixed(1),
      learningOutcomes: (sum.learningOutcomes / count).toFixed(1),
      frequencyAndQualityOfMeetings: (sum.frequencyAndQualityOfMeetings / count).toFixed(1)
    };
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const averageRatings = calculateAverageRating(feedback);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Mentor Feedback</h2>
      {feedback.length === 0 ? (
        <p className="text-gray-500">No feedback found.</p>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overall Average Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Communication Skills: {averageRatings.communicationSkills}</p>
              <p>Clarity of Guidance: {averageRatings.clarityOfGuidance}</p>
              <p>Learning Outcomes: {averageRatings.learningOutcomes}</p>
              <p>Frequency and Quality of Meetings: {averageRatings.frequencyAndQualityOfMeetings}</p>
            </CardContent>
          </Card>
          <Accordion type="single" collapsible>
            {feedback.map((item, index) => (
              <AccordionItem key={item._id} value={`item-${index}`}>
                <AccordionTrigger>
                  Feedback for {item.mentorId.name} from {item.userId.name}
                </AccordionTrigger>
                <AccordionContent>
                  <p>Communication Skills: {item.rating.communicationSkills}</p>
                  <p>Clarity of Guidance: {item.rating.clarityOfGuidance}</p>
                  <p>Learning Outcomes: {item.rating.learningOutcomes}</p>
                  <p>Frequency and Quality of Meetings: {item.rating.frequencyAndQualityOfMeetings}</p>
                  <p>Remarks: {item.rating.remarks}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default MentorFeedback;