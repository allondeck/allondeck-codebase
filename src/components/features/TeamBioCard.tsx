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
      className="relative mb-16 md:mb-20 bg-[#05586d] rounded-[2rem] border border-brand-medium/35 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 shadow-lg text-white"
    >
      {/* Photo & Wave wrapper */}
      <div className="relative w-56 md:w-64 lg:w-72 aspect-[3/4] shrink-0 md:-mb-16 lg:-mb-20 z-10">
        {/* Photo Box */}
        <div className="w-full h-full overflow-hidden rounded-[2rem] border border-brand-medium/35 bg-brand-dark-alt shadow-2xl">
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Wave decoration overlapping bottom-right across bottom edge of card */}
        <div className="absolute bottom-4 -right-16 md:-right-24 w-44 md:w-56 pointer-events-none z-20">
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
        <h3 className="font-heading text-lg md:text-2xl xl:text-3xl font-bold tracking-widest leading-tight uppercase">
          <span className="text-[#8fc5db] mr-2">{role}</span>
          <span className="text-brand-cream">{name}</span>
        </h3>
        <p className="mt-3 xl:mt-5 md:text-xl xl:text-2xl font-medium leading-relaxed text-white/95 font-sans">
          {bioText}
        </p>

        {/* Contact Icons */}
        <div className="mt-5 flex justify-center md:justify-start items-center gap-4">
          {/* WhatsApp Speech Bubble Icon */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center transition-transform hover:scale-105"
            aria-label="WhatsApp"
          >
            <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none">
              {/* Orange speech bubble background with bottom-left pointer */}
              <path
                fill="#e98e2e"
                d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.19 1.87 5.84L2.5 21.5l3.82-1.33C7.91 21.28 9.89 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
              />
              {/* Brand navy phone handset inside the bubble */}
              <path
                fill="#044155"
                d="M16.27 14.12c-.25-.13-1.46-.72-1.68-.8-.22-.09-.39-.13-.55.13-.16.26-.63.8-.78.97-.15.16-.29.18-.55.05-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.29.39-.44.13-.15.17-.26.26-.43.09-.16.04-.31-.02-.44s-.55-1.33-.75-1.82c-.2-.47-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.43.06-.65.31-.22.25-.86.86-.86 2.08s.89 2.41 1.01 2.57c.13.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.66-1.17.21-.57.21-1.07.15-1.17-.06-.1-.22-.16-.48-.29z"
              />
            </svg>
          </a>

          {/* Email Icon */}
          <a
            href={`mailto:${email}`}
            className="flex size-[42px] shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-brand-navy hover:scale-105 transition-transform"
            aria-label="Email"
          >
            <svg className="size-[32px]" viewBox="0 0 48 48" fill="none">
              {/* Top Flap Section */}
              <path
                d="M7 11H41C41.6 11 42.1 11.2 42.5 11.5L25.3 25.1C24.5 25.7 23.5 25.7 22.7 25.1L5.5 11.5C5.9 11.2 6.4 11 7 11Z"
                fill="#044155"
              />
              {/* Bottom Body Section */}
              <path
                d="M8.2 37H39.8L27.2 27.2L24.8 29.1C24.3 29.5 23.7 29.5 23.2 29.1L20.8 27.2L8.2 37Z"
                fill="#044155"
              />
              {/* Left Side Section */}
              <path
                d="M5 14.2V34.8C5 35.6 5.4 36.3 6.1 36.7L18.8 25.1L5 14.2Z"
                fill="#044155"
              />
              {/* Right Side Section */}
              <path
                d="M43 14.2L29.2 25.1L41.9 36.7C42.6 36.3 43 35.6 43 34.8V14.2Z"
                fill="#044155"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
