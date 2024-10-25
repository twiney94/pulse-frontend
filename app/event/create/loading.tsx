import Layout from "@/app/components/Layout";

export default function Loading() {
  return <Skeleton />;
}

const Skeleton = () => (
  <Layout>
    <div className="space-y-6">
      <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex gap-2">
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </Layout>
);
