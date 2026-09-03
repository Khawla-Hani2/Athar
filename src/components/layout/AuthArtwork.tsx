import { Icon } from '@/components/ui/Icon'

/** Decorative coastal panel shown beside the login / signup forms on wide screens. */
export function AuthArtwork() {
  return (
    <div className="hidden md:block flex-1 relative overflow-hidden bg-gradient-to-br from-teal-900 via-[#123f3b] to-palm-700">
      <svg
        viewBox="0 0 400 640"
        className="absolute inset-0 w-full h-full opacity-90"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M0 420 Q100 380 200 420 T400 420" stroke="#E0B978" strokeWidth="1.4" fill="none" opacity=".5" />
        <path d="M0 460 Q100 425 200 460 T400 460" stroke="#F1E9D8" strokeWidth="1.4" fill="none" opacity=".3" />
        <path d="M0 500 Q100 470 200 500 T400 500" stroke="#E0B978" strokeWidth="1.4" fill="none" opacity=".2" />
      </svg>
      <Icon name="athar" className="absolute w-[210px] h-[210px] text-paper-alt opacity-[0.08] top-16 -end-8" />
      <div className="absolute bottom-14 inset-x-14 text-paper-alt">
        <p className="font-display text-[19px] lg:text-[21px] leading-relaxed">
          "مساحتك الخاصة لتعرفي ماذا أنجزتِ، وماذا تحتاجين، وما الذي يستحق تركيزك الآن."
        </p>
      </div>
    </div>
  )
}
