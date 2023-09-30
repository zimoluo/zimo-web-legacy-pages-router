import MainPageLayout from "@/components/MainPageLayout";
import PhotosTextSide from "@/components/photos/PhotosTextSide";

export default function Home() {
  return (
    <MainPageLayout theme="photos">
      <div className="w-96 h-auto m-10 border-2 border-black">
        <PhotosTextSide
          title={"Some Photo Post"}
          date={"2022-11-27T08:00:00.000Z"}
          author={"Zimo"}
          authorProfile={
            "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/author/zimo.svg"
          }
          slug={"test"}
          location={{
            latitude: 41.40338,
            longitude: 2.17403,
            name: "Barcelona",
          }}
        />
      </div>
    </MainPageLayout>
  );
}
