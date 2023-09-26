import MainPageLayout from "@/components/MainPageLayout";
import CommentCardWrapper from "@/components/comments/CommentCardWrapper";

export default function Home() {
  return (
    <MainPageLayout theme="photos">
      <div className="h-placeholder w-full py-20 px-20">
        <div className="w-1/3">
          <CommentCardWrapper
            resourceLocation="test/test-comments.json"
            theme="photos"
          />
          <div>hi</div>
        </div>
      </div>
    </MainPageLayout>
  );
}
