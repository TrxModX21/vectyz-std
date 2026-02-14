import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const UploadInstructionCard = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Upload Files Form</CardTitle>
        <CardDescription>Fil all form to upload your files</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="guide">
          <AccordionItem value="guide">
            <AccordionTrigger>Upload Guide</AccordionTrigger>
            <AccordionContent>
              For uploading please select or drop your original image into the
              drop zone. And also you have to wrap your picture with your PSD,
              Ai, XD etc, (if any) including this file below as a zip file. Then
              in the zip file section upload it. Otherwise, your image won't be
              approved
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default UploadInstructionCard;
