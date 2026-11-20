import Link from "next/link";
import { Sparkle } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="wrap paper relative py-24 text-center">
      <Sparkle className="mx-auto h-14 w-14 text-gold-d" />
      <h1 className="mt-8 text-[34px] md:text-[52px]">
        Энэ хуудас <span className="script text-berry">олдсонгүй</span>
      </h1>
      <p className="mt-3 text-ink-2">Хаяг буруу эсвэл бараа шилжсэн байж магадгүй. Хайлтаар эсвэл ангиллаар хайгаарай.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-wine">
          Бүх бараа
        </Link>
        <Link href="/" className="btn btn-light">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
