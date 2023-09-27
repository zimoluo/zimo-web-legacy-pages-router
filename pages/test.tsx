import MainPageLayout from "@/components/MainPageLayout";
import CommentCardWrapper from "@/components/comments/CommentCardWrapper";

export default function Home() {
  return (
    <MainPageLayout theme="blog">
      <div className="h-full w-full py-20 px-20">
        <div style={{ width: '60rem' }}>
          <CommentCardWrapper
            resourceLocation="test/test-comments.json"
            theme="blog"
          />
          <div>hi</div>
        </div>
      </div>
    </MainPageLayout>
  );
}
