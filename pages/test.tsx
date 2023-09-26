import MainPageLayout from "@/components/MainPageLayout";
import CommentCardWrapper from "@/components/comments/CommentCardWrapper";

export default function Home() {
  return (
    <MainPageLayout theme="photos">
      <div className="h-placeholder w-full py-20 px-20">
        <div className="w-1/3">
          <CommentCardWrapper
            comments={[
              {
                author: "101139300101436223731",
                date: "2022-11-27T08:00:00.000Z",
                content: "this is a test comment",
                likedBy: ["102473892069227634874"],
                replies: [
                  {
                    from: "102476483136093045893",
                    content: "this is a reply",
                    date: "2022-11-27T08:00:00.000Z",
                  },
                  {
                    from: "101139300101436223731",
                    to: "102473892069227634874",
                    content: "im replying myself",
                    date: "2022-11-27T18:00:00.000Z",
                  },
                ],
              },
              {
                author: "101139300101436223731",
                date: "2022-11-27T08:00:00.000Z",
                content: "this is a test comment",
                likedBy: ["102476483136093045893"],
                replies: [
                  {
                    from: "102476483136093045893",
                    content: "this is a reply",
                    date: "2022-11-27T08:00:00.000Z",
                  },
                  {
                    from: "101139300101436223731",
                    to: "102473892069227634874",
                    content: "im replying myself",
                    date: "2022-11-27T18:00:00.000Z",
                  },
                ],
              },
            ]}
            theme="photos"
          />
          <div>hi</div>
        </div>
      </div>
    </MainPageLayout>
  );
}
