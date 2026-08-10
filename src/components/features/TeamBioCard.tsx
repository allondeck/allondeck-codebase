/**
 * TeamBioCard.tsx
 * 
 * Reusable card component for displaying team member bios with full photo, 
 * role badge, detailed description, and direct contact buttons (WhatsApp, Email).
 */

interface TeamBioCardProps {
  /** Section HTML ID for smooth scrolling targets (e.g. "ernesto-bio") */
  id: string;
  /** Full name of the team member */
  name: string;
  /** Role/Title (e.g. "PRESIDENT.") */
  role: string;
  /** Path to portrait photo */
  imageSrc: string;
  /** Bio text paragraph */
  bioText: string;
  /** WhatsApp link target URL */
  whatsappUrl: string;
  /** Email address */
  email: string;
}

export function TeamBioCard({
  id,
  name,
  role,
  imageSrc,
  bioText,
  whatsappUrl,
  email,
}: TeamBioCardProps) {
  return (
    <div
      id={id}
      className="relative mt-20 md:mt-0 bg-[#05586d] rounded-[2rem] border border-brand-medium/35 px-6 py-8 md:py-6 md:pl-0 md:pr-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-lg text-white"
    >
      {/* Photo & Wave wrapper */}
      <div className="relative w-48 md:w-52 aspect-[3/4] shrink-0 -mt-24 md:-mt-12 md:-mb-12 md:-ml-12 z-10">
        {/* Photo Box */}
        <div className="w-full h-full overflow-hidden rounded-[2rem] border border-brand-medium/35 bg-brand-dark-alt shadow-xl">
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Wave decoration overlapping bottom-right */}
        <div className="absolute -bottom-4 -right-4 w-32 pointer-events-none z-20">
          <svg
            viewBox="0 0 380.442 62.684"
            className="w-full h-auto text-brand-light"
            fill="currentColor"
          >
            <path d="M380.437,15.6a4.388,4.388,0,0,0-6.319-3.88c-10.453,4.8-19.785,1.364-28.981-4.008-.894-.522-1.909-.894-2.833-1.383C328.072-1.2,313.45-1.45,299.969,6.776c-14.137,8.628-26.9,8.967-41.157.237C245.143-1.359,230.1-1.622,215.963,6.46a72.2,72.2,0,0,1-8.834,4.334c-8.749,3.522-17.668,4.336-27.3.326-.792-.318-1.581-.652-2.367-1.019q-.972-.453-1.94-.95-1.05-.538-2.1-1.122c-.519-.289-1.038-.579-1.556-.881-.894-.522-1.909-.894-2.833-1.383C154.8-1.764,140.181-2.012,126.7,6.214c-14.137,8.628-26.9,8.966-41.157.237C71.875-1.922,56.836-2.185,42.7,5.9,30.953,12.609,19.3,16.126,6.311,10.614A4.348,4.348,0,0,0,.272,14.681a41.477,41.477,0,0,1-.213,5.4c-.465,3.926,1.845,5.278,6.512,6.4a55.747,55.747,0,0,0,37.374-4.266q5.23-2.549,10.491-5.056a20.369,20.369,0,0,1,18.1-.135c5.432,2.524,10.784,5.174,16.243,7.654a41.316,41.316,0,0,0,33.52.355c5.6-2.434,11.045-5.142,16.508-7.8a21.456,21.456,0,0,1,18.648-.021c6.076,2.906,12.1,5.918,18.374,8.494.13.053.262.09.392.142.808.322,1.618.613,2.431.881a61.814,61.814,0,0,0,7.53,1.681,44.616,44.616,0,0,0,27.331-3.824q7.074-3.46,14.189-6.862a20.371,20.371,0,0,1,18.1-.135c5.431,2.524,10.783,5.173,16.242,7.654a41.308,41.308,0,0,0,33.52.355c5.6-2.434,11.045-5.142,16.508-7.8a21.456,21.456,0,0,1,18.648-.021c6.077,2.906,12.1,5.918,18.374,8.494a36.531,36.531,0,0,0,27.191.631c1.569-.576,3.8-1.868,3.9-2.944C380.427,21.268,380.457,18.572,380.437,15.6Z" />
            <path d="M380.437,49.068a4.388,4.388,0,0,0-6.319-3.881c-10.453,4.8-19.785,1.364-28.981-4.008-.894-.522-1.909-.894-2.833-1.382-14.232-7.53-28.854-7.778-42.335.449-14.137,8.627-26.9,8.966-41.157.236-13.669-8.372-28.708-8.635-42.849-.553a72.2,72.2,0,0,1-8.834,4.334c-8.749,3.522-17.668,4.336-27.3.326-.792-.317-1.581-.651-2.367-1.018q-.972-.454-1.94-.95-1.05-.54-2.1-1.123c-.519-.289-1.038-.579-1.556-.881-.894-.522-1.909-.894-2.833-1.383-14.232-7.529-28.855-7.777-42.335.449-14.137,8.628-26.9,8.967-41.157.237-13.669-8.372-28.708-8.635-42.849-.553C30.953,46.079,19.3,49.6,6.311,44.083A4.349,4.349,0,0,0,.272,48.15a41.477,41.477,0,0,1-.213,5.4c-.465,3.926,1.845,5.279,6.512,6.4a55.747,55.747,0,0,0,37.374-4.266q5.23-2.549,10.491-5.056a20.369,20.369,0,0,1,18.1-.135c5.432,2.524,10.784,5.174,16.243,7.654a41.312,41.312,0,0,0,33.52.355c5.6-2.433,11.045-5.142,16.508-7.8a21.456,21.456,0,0,1,18.648-.021c6.076,2.906,12.1,5.918,18.374,8.494.13.053.262.09.392.142q1.212.483,2.431.881a61.814,61.814,0,0,0,7.53,1.681,44.616,44.616,0,0,0,27.331-3.824q7.074-3.46,14.189-6.862a20.375,20.375,0,0,1,18.1-.135c5.431,2.524,10.783,5.174,16.242,7.654a41.308,41.308,0,0,0,33.52.355c5.6-2.433,11.045-5.142,16.508-7.8a21.452,21.452,0,0,1,18.648-.02c6.077,2.905,12.1,5.917,18.374,8.493a36.531,36.531,0,0,0,27.191.631c1.569-.576,3.8-1.867,3.9-2.944C380.427,54.737,380.457,52.042,380.437,49.068Z" />
          </svg>
        </div>
      </div>

      {/* Text & Contact Info */}
      <div className="w-full text-center md:text-left flex-1">
        <h3 className="font-heading text-lg md:text-xl font-bold tracking-widest leading-tight uppercase">
          <span className="text-[#8fc5db] mr-2">{role}</span>
          <span className="text-brand-cream">{name}</span>
        </h3>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-white/90 font-sans">
          {bioText}
        </p>

        {/* Contact Icons */}
        <div className="mt-5 flex justify-center md:justify-start items-center gap-4">
          {/* WhatsApp Icon */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center hover:scale-105 transition-transform"
            aria-label="WhatsApp"
          >
            <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none">
              <path
                fill="#e88d25"
                d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.19 1.87 5.84L2.5 21.5l3.82-1.33C7.91 21.28 9.89 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
              />
              <path
                fill="#05586d"
                d="M15.5 13.8c-.3-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.3-.74.94-.91 1.13-.17.19-.34.21-.64.06-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.34.45-.51.15-.17.2-.3.3-.5.1-.19.05-.36-.02-.51s-.64-1.55-.88-2.12c-.23-.55-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.04 2.81 1.18 3 .15.19 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.56-.34z"
              />
            </svg>
          </a>

          {/* Email Icon */}
          <a
            href={`mailto:${email}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-[#05586d] hover:scale-105 transition-transform"
            aria-label="Email"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#05586d">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
