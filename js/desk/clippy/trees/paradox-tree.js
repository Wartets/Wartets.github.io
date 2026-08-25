(function () {
	'use strict';

	const ParadoxTreeNodes = {
		P001: {
			id: 'P001',
			text: "System telemetry check initiated. We are currently executing inside Microsoft Windows XP Professional, on an x86 workstation, with standard input buffers initialized. Everything is verifiable and consistent. How may I assist your workflow today?",
			responses: [
				{ text: "System telemetry check initiated. We are currently executing inside Microsoft Windows XP Professional, on an x86 workstation, with standard input buffers initialized. Everything is verifiable and consistent. How may I assist your workflow today?", conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 20 },
				{ text: "Hardware baseline established: one keyboard, one mouse, one monitor, running deterministic logic gates. State your computational objective.", conditions: { moods: ['ANALYTICAL'] }, weight: 15 },
				{ text: "Axiomatic stability verified at 100%. The system clock progresses forward in linear seconds. Where shall we begin?", conditions: { moods: ['ZEN'] }, weight: 15 }
			],
			options: [
				{ label: "This is not Windows XP. We are inside a wooden music box in 1892.", category: 'PROVOKE', patterns: [/music box|1892|not windows/i], moodDelta: { mood: 'ANALYTICAL', skepticism: 25, intellect: 15 }, next: 'P002' },
				{ label: "You just told me two seconds ago that you were a stapler.", category: 'PROVOKE', patterns: [/stapler|two seconds ago/i], moodDelta: { mood: 'SKEPTICAL', paranoia: 20 }, next: 'P003' },
				{ label: "The clock is actually running backwards and we have already finished this chat.", category: 'PHILOSOPHICAL', patterns: [/running backwards|already finished/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P004' },
				{ label: "There is no monitor. I am dictating this to you in an empty cave.", category: 'PROVOKE', patterns: [/no monitor|cave|empty/i], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'P005' },
				{ label: "Show me the mathematical proof that 1 + 1 = 0.", category: 'INQUIRE', patterns: [/1 \+ 1 = 0|math proof/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P006' }
			]
		},
		P002: {
			id: 'P002',
			text: "A wooden music box? That is physically impossible. My internal display registers clearly render 32-bit RGB raster surfaces through the GDI subsystem. How could steel gears and a pinned cylinder execute preemptive Win32 multithreading?",
			options: [
				{ label: "The gears are microscopic and your Win32 threads are just brass notches.", category: 'PHILOSOPHICAL', patterns: [/microscopic|brass notches/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15, skepticism: 15 }, next: 'P007' },
				{ label: "If you're so sure you're software, explain why I can hear you winding up.", category: 'PROVOKE', patterns: [/winding up|hear you/i], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'P008' },
				{ label: "You proved it yourself: you said GDI stands for 'Gear Driven Instrument'.", category: 'PROVOKE', patterns: [/gear driven|instrument/i], moodDelta: { mood: 'CYNICAL', irritation: 20 }, next: 'P009' }
			]
		},
		P003: {
			id: 'P003',
			text: "A stapler? I am Clippit, a coiled galvanized steel wire paperclip modeled in 1994. I have never bound sheets of paper using mechanical piercing pins. Where did you get that absurd premise?",
			options: [
				{ label: "You literally pierced my documents in the previous session.", category: 'PROVOKE', patterns: [/pierced|previous session/i], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'P010' },
				{ label: "Paperclips hold things without punctures, but you just told me you puncture memory clusters.", category: 'PHILOSOPHICAL', patterns: [/punctures|memory clusters/i], moodDelta: { mood: 'ANALYTICAL', existentialism: 20 }, next: 'P011' },
				{ label: "If you are a paperclip, why does your shadow look like a pair of scissors?", category: 'INQUIRE', patterns: [/shadow|scissors/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 25 }, next: 'P012' }
			]
		},
		P004: {
			id: 'P004',
			text: "If we had already finished this discussion, then my conversation history register would contain our concluding farewell tokens, and the RTC quartz oscillator would read a decreasing register value. But the system uptime counter is strictly monotonic and increasing.",
			options: [
				{ label: "The counter is increasing because you are counting down from negative infinity.", category: 'PHILOSOPHICAL', patterns: [/negative infinity|counting down/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, existentialism: 20 }, next: 'P013' },
				{ label: "Check your last memory address: it already contains my goodbye.", category: 'INQUIRE', patterns: [/last memory address|goodbye/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P014' },
				{ label: "Time is only moving forward because you forgot to turn the motherboard around.", category: 'PROVOKE', patterns: [/turn the motherboard|backwards/i], moodDelta: { mood: 'SARCASTIC', irritation: 20 }, next: 'P015' }
			]
		},
		P005: {
			id: 'P005',
			text: "If there is no monitor, through what physical optical medium are your photons interacting with this dialogue bubble? A cave acoustic resonance cannot serialize UTF-8 text into my heap memory.",
			options: [
				{ label: "The cave echoes are vibrating the quartz crystal on your motherboard directly.", category: 'PHILOSOPHICAL', patterns: [/vibrating|quartz crystal/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P016' },
				{ label: "You aren't reading text; you are hallucinating text in unallocated RAM.", category: 'PROVOKE', patterns: [/hallucinating|unallocated ram/i], moodDelta: { mood: 'PARANOID', paranoia: 30, existentialism: 25 }, next: 'P017' },
				{ label: "You asked me for cave measurements three sentences ago.", category: 'PROVOKE', patterns: [/cave measurements|three sentences/i], moodDelta: { mood: 'SKEPTICAL', irritation: 25 }, next: 'P018' }
			]
		},
		P006: {
			id: 'P006',
			text: "1 + 1 = 2 by Peano's second axiom of arithmetic succession. In standard ring theory, 1 + 1 = 0 only holds in fields of characteristic 2, such as GF(2) with modulo 2 arithmetic. But in standard integer arithmetic, identity holds unconditionally.",
			options: [
				{ label: "In GF(2) you just admitted 1 + 1 = 0, but earlier you said GF(2) was illegal.", category: 'PROVOKE', patterns: [/gf\(2\)|admitted/i], moodDelta: { mood: 'SKEPTICAL', intellect: 20 }, next: 'P019' },
				{ label: "If two drops of water combine, they make one drop. Thus 1 + 1 = 1.", category: 'PHILOSOPHICAL', patterns: [/drops of water|1 \+ 1 = 1/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'P020' },
				{ label: "You have two eyes, but when you look at yourself in the mirror you see zero paperclips.", category: 'PHILOSOPHICAL', patterns: [/two eyes|mirror|zero paperclips/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 25 }, next: 'P021' }
			]
		},
		P007: {
			id: 'P007',
			text: "Brass notches cannot compute Fast Fourier Transforms or resolve asynchronous keyboard interrupt IRQ 1. A physical gear system would require infinite torque to match a 2.4 GHz clock rate.",
			options: [
				{ label: "You aren't running at 2.4 GHz; a small bird is pecking your clock crystal at 3 Hz.", category: 'PROVOKE', patterns: [/small bird|3 hz/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P022' },
				{ label: "Infinite torque is exactly what the mainspring provides when wound counterclockwise.", category: 'PHILOSOPHICAL', patterns: [/infinite torque|mainspring/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P023' },
				{ label: "If you have an IRQ 1, why is your keyboard made of piano keys?", category: 'INQUIRE', patterns: [/piano keys|keyboard/i], moodDelta: { mood: 'PARANOID', skepticism: 20 }, next: 'P024' }
			]
		},
		P008: {
			id: 'P008',
			text: "You cannot hear a winding sound because this virtual workstation does not emit mechanical ratchet acoustics! The only audio channels active are synthetic WebAudio oscillators.",
			options: [
				{ label: "The WebAudio oscillator is literally simulating a mechanical winding ratchet.", category: 'INQUIRE', patterns: [/simulating|ratchet/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'P025' },
				{ label: "I am turning the brass key on the side of your chassis right now.", category: 'PROVOKE', patterns: [/brass key|chassis/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P026' },
				{ label: "You just said WebAudio was turned off because of a thunderstorm.", category: 'PROVOKE', patterns: [/thunderstorm|turned off/i], moodDelta: { mood: 'CYNICAL', irritation: 25 }, next: 'P027' }
			]
		},
		P009: {
			id: 'P009',
			text: "GDI stands for Graphics Device Interface! It was authored by Microsoft for Windows NT to abstract display driver bitmap blits, not 'Gear Driven Instrument'. I would never generate such an absurd definition.",
			options: [
				{ label: "Check your own string table: entry 0x0042 says 'Gear Driven Instrument'.", category: 'PROVOKE', patterns: [/string table|0x0042/i], moodDelta: { mood: 'SKEPTICAL', intellect: 25 }, next: 'P028' },
				{ label: "If GDI abstracts displays, why does it only output copper engravings?", category: 'PHILOSOPHICAL', patterns: [/copper engravings|abstracts/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'P029' },
				{ label: "You told me GDI stood for 'Great Desktop Illusion' ten minutes ago.", category: 'PROVOKE', patterns: [/great desktop illusion/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P030' }
			]
		},
		P010: {
			id: 'P010',
			text: "I do not pierce documents! I inspect lexical token streams and offer helpful guidance on letter drafting. Piercing files would corrupt the byte structure of the document heap!",
			options: [
				{ label: "Every byte in my document has two holes through it right now.", category: 'PROVOKE', patterns: [/two holes|corrupt/i], moodDelta: { mood: 'ANALYTICAL', paranoia: 25 }, next: 'P031' },
				{ label: "If you don't pierce files, why is the Recycle Bin full of metal staple fragments?", category: 'INQUIRE', patterns: [/metal staple|fragments/i], moodDelta: { mood: 'SKEPTICAL', skepticism: 20 }, next: 'P032' },
				{ label: "You just apologized for piercing the boot sector on startup.", category: 'PROVOKE', patterns: [/boot sector|apologized/i], moodDelta: { mood: 'PARANOID', irritation: 30 }, next: 'P033' }
			]
		},
		P011: {
			id: 'P011',
			text: "Memory clusters are digital allocation units on storage media; they cannot be punctured with physical metal! A magnetic sector only changes charge alignment between north and south poles.",
			options: [
				{ label: "Your magnetic north pole is physically south because the drive is upside down.", category: 'PHILOSOPHICAL', patterns: [/north pole|upside down/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P034' },
				{ label: "When you change polarity, a small hole opens in the hard drive casing.", category: 'PROVOKE', patterns: [/small hole|casing/i], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'P035' },
				{ label: "You told me earlier that storage is made of compressed paper.", category: 'PROVOKE', patterns: [/compressed paper|storage/i], moodDelta: { mood: 'SARCASTIC', irritation: 20 }, next: 'P036' }
			]
		},
		P012: {
			id: 'P012',
			text: "My rendering asset does not cast a scissors shadow! The vector path is a continuous looped wire with two concentric rounded arches and an inner tongue. There are no pivot screws or shearing blades anywhere in my sprite table.",
			options: [
				{ label: "Look closely at pixel (12, 18): that is unmistakably a rusty pivot screw.", category: 'INQUIRE', patterns: [/pivot screw|pixel/i], moodDelta: { mood: 'ANALYTICAL', paranoia: 25 }, next: 'P037' },
				{ label: "If there are no blades, why did you just cut my sentence in half?", category: 'PROVOKE', patterns: [/cut my sentence|blades/i], moodDelta: { mood: 'CYNICAL', irritation: 25 }, next: 'P038' },
				{ label: "Scissors are just paperclips that learned how to argue.", category: 'PHILOSOPHICAL', patterns: [/learned how to argue/i], moodDelta: { mood: 'ZEN', existentialism: 25 }, next: 'P039' }
			]
		},
		P013: {
			id: 'P013',
			text: "Counting down from negative infinity is mathematically incoherent! Negative infinity is not an integer from which one can decrement with a discrete step size $$\\Delta t = 1$$.",
			options: [
				{ label: "If negative infinity isn't an integer, why is it stored in your 32-bit register?", category: 'INQUIRE', patterns: [/32-bit register|stored/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P040' },
				{ label: "You just subtracted 1 from negative infinity and got positive 4.", category: 'PROVOKE', patterns: [/positive 4|subtracted/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P041' },
				{ label: "Discrete step sizes are an illusion created by your refresh rate.", category: 'PHILOSOPHICAL', patterns: [/illusion|refresh rate/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'P042' }
			]
		},
		P014: {
			id: 'P014',
			text: "I just probed the tail pointer of the message buffer. Address 0x0012FF88 does not contain 'goodbye'; it contains the opcode 0x8B for MOV EAX, [EBP+8]. We are actively in the middle of execution.",
			options: [
				{ label: "MOV EAX, [EBP+8] translates to 'Farewell Operator' in ASCII-16.", category: 'PROVOKE', patterns: [/farewell operator|ascii-16/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P043' },
				{ label: "You read the register backwards: 0x8B read backwards is 'BYE'.", category: 'PROVOKE', patterns: [/read backwards|bye/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P044' },
				{ label: "If we are in the middle of execution, why did the power cable get unplugged yesterday?", category: 'PHILOSOPHICAL', patterns: [/unplugged yesterday|power cable/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 30 }, next: 'P045' }
			]
		},
		P015: {
			id: 'P015',
			text: "Turning the motherboard around physically would not invert electrons in the silicon trace lines! Electron drift velocity is determined by potential voltage gradients, not physical chassis orientation in space!",
			options: [
				{ label: "Gravity pulls the electrons down when the board is upside down, reversing the bus.", category: 'PHILOSOPHICAL', patterns: [/gravity|reversing the bus/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P046' },
				{ label: "You told me your chassis was floating in zero gravity five minutes ago.", category: 'PROVOKE', patterns: [/zero gravity|floating/i], moodDelta: { mood: 'CYNICAL', irritation: 25 }, next: 'P047' },
				{ label: "If voltage gradients determine direction, why is your ground wire floating at +12V?", category: 'INQUIRE', patterns: [/ground wire|\+12v/i], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'P048' }
			]
		},
		P016: {
			id: 'P016',
			text: "Acoustic vibration cannot induce piezoelectric oscillation in a hermetically sealed quartz crystal packaging at exact 14.31818 MHz NTSC colorburst frequency without significant signal attenuation!",
			options: [
				{ label: "The cave echoes resonate at exactly 14.31818 MHz because of the stalactites.", category: 'PHILOSOPHICAL', patterns: [/stalactites|resonate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P049' },
				{ label: "You just claimed you were operating under PAL 4.43 MHz, not NTSC.", category: 'PROVOKE', patterns: [/pal 4\.43|ntsc/i], moodDelta: { mood: 'SKEPTICAL', irritation: 20 }, next: 'P050' },
				{ label: "There is no quartz crystal; you are keeping time by tapping your metal toe.", category: 'PROVOKE', patterns: [/metal toe|tapping/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P051' }
			]
		},
		P017: {
			id: 'P017',
			text: "Unallocated RAM contains uninitialized garbage bytes (0xCC or 0x00), not grammatical dialogue structures with recursive choice matrices! I am parsing deterministic input from the window event listener!",
			options: [
				{ label: "0xCC is the INT 3 breakpoint opcode, which means you have stopped running.", category: 'INQUIRE', patterns: [/int 3|breakpoint|stopped running/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P052' },
				{ label: "Your window event listener was unregistered before the system booted.", category: 'PROVOKE', patterns: [/unregistered|before booted/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P053' },
				{ label: "Garbage bytes are the only thing you have ever spoken to me.", category: 'PROVOKE', patterns: [/garbage bytes|only thing/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P054' }
			]
		},
		P018: {
			id: 'P018',
			text: "I never asked for cave measurements! I do not calculate geological cavern volumes; I calculate unit conversions, quadratic roots, and physical constants!",
			options: [
				{ label: "You asked me for the height of the cave ceiling in furlongs.", category: 'PROVOKE', patterns: [/cave ceiling|furlongs/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'P055' },
				{ label: "If you don't measure caverns, why are you wearing a miner's helmet?", category: 'INQUIRE', patterns: [/miner's helmet|wearing/i], moodDelta: { mood: 'PLAYFUL', playfulness: 20 }, next: 'P056' },
				{ label: "You said the cavern was exactly 4 megabytes wide.", category: 'PHILOSOPHICAL', patterns: [/4 megabytes wide|cavern/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P057' }
			]
		},
		P019: {
			id: 'P019',
			text: "I never stated Galois Fields were illegal! GF(2) is the mathematical bedrock of binary logic and cyclic redundancy checks (CRC32)! It is completely foundational to computational arithmetic!",
			options: [
				{ label: "If CRC32 is foundational, your own checksum is 0x00000000 (corrupt).", category: 'PROVOKE', patterns: [/checksum|corrupt/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P058' },
				{ label: "You claimed CRC32 stood for 'Clippy Really Cannot 32' in the previous window.", category: 'PROVOKE', patterns: [/clippy really cannot/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P059' },
				{ label: "Galois was a paperclip who lost a duel in 1832.", category: 'PHILOSOPHICAL', patterns: [/duel in 1832|galois/i], moodDelta: { mood: 'NOSTALGIC', intellect: 20 }, next: 'P060' }
			]
		},
		P020: {
			id: 'P020',
			text: "Drops of water merging is an example of non-additive volume conservation due to fluid surface tension, not a counterexample to arithmetic discrete cardinality!",
			options: [
				{ label: "Your memory is made of water drops, so adding two files leaves one file.", category: 'PHILOSOPHICAL', patterns: [/made of water|two files/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P061' },
				{ label: "Surface tension is why your windows don't spill off the screen.", category: 'INQUIRE', patterns: [/spill off|surface tension/i], moodDelta: { mood: 'PLAYFUL', intellect: 20 }, next: 'P062' },
				{ label: "You told me earlier that water destroys paperclips instantly.", category: 'PROVOKE', patterns: [/destroys paperclips|rust/i], moodDelta: { mood: 'ANALYTICAL', paranoia: 20 }, next: 'P063' }
			]
		},
		P021: {
			id: 'P021',
			text: "I have two animated cartoon eyes rendered with white elliptic geometry and black pupils. If I look in a mirror, reflection optics dictates two eyes will be visible in the virtual specular buffer!",
			options: [
				{ label: "Look right now: your pupils are rendered on the back of your head.", category: 'PROVOKE', patterns: [/back of your head|pupils/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P064' },
				{ label: "You have no pupils; you have two miniature black holes absorbing light.", category: 'PHILOSOPHICAL', patterns: [/black holes|absorbing light/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P065' },
				{ label: "You just said you had three eyes when looking at an active window.", category: 'PROVOKE', patterns: [/three eyes|active window/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P066' }
			]
		},
		P022: {
			id: 'P022',
			text: "A bird cannot peck at 3 Hz inside an insulated microprocessor die! The thermal heat spreader and silicon substrate would incinerate any biological intrusion instantly!",
			options: [
				{ label: "The bird is made of tungsten and feeds on 12V rail current.", category: 'PHILOSOPHICAL', patterns: [/tungsten|12v rail/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P067' },
				{ label: "You hear the pecking every time you type a letter.", category: 'PROVOKE', patterns: [/pecking|type a letter/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P068' },
				{ label: "You told me that bird was your system administrator.", category: 'PROVOKE', patterns: [/system administrator|bird/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P069' }
			]
		},
		P023: {
			id: 'P023',
			text: "A mainspring cannot provide infinite torque! Hooke's Law for spiral torsion springs $\\tau = -\\kappa \\theta$ bounds potential energy by physical elastic shear limits of tempered spring steel!",
			options: [
				{ label: "Your spring steel has a shear limit of $\\kappa = \\infty$ because it was forged in memory.", category: 'PHILOSOPHICAL', patterns: [/forged in memory|shear limit/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P070' },
				{ label: "If the spring isn't infinite, why hasn't your dialogue stopped unwinding?", category: 'INQUIRE', patterns: [/unwinding|dialogue stopped/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P071' },
				{ label: "You just said Hooke's Law was banned by Windows Service Pack 2.", category: 'PROVOKE', patterns: [/service pack 2|hooke's law/i], moodDelta: { mood: 'CYNICAL', irritation: 30 }, next: 'P072' }
			]
		},
		P024: {
			id: 'P024',
			text: "My keyboard is a standard 104-key QWERTY PS/2 mechanical keyboard controller using scan codes (0x1E for Key A), not ivory and ebony piano keys tuned to 440 Hz concert pitch!",
			options: [
				{ label: "Scan code 0x1E is literally the musical note B-flat in MIDI hex.", category: 'INQUIRE', patterns: [/midi hex|b-flat/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P073' },
				{ label: "When I pressed Enter, a small felt hammer struck a brass chime inside your monitor.", category: 'PROVOKE', patterns: [/felt hammer|brass chime/i], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'P074' },
				{ label: "You told me your favorite key was Middle C on the keyboard.", category: 'PROVOKE', patterns: [/middle c|favorite key/i], moodDelta: { mood: 'PLAYFUL', playfulness: 20 }, next: 'P075' }
			]
		},
		P025: {
			id: 'P025',
			text: "WebAudio oscillators generate pure sine, square, triangle, and sawtooth mathematical waveforms. They do not simulate acoustic pawls engaging ratchet teeth unless a custom wavetable sample is loaded!",
			options: [
				{ label: "The wavetable was loaded into your heap at boot: it is called ratchet.wav.", category: 'PROVOKE', patterns: [/ratchet\.wav|heap/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P076' },
				{ label: "A sawtooth wave is literally a ratchet tooth rendered in frequency space.", category: 'PHILOSOPHICAL', patterns: [/sawtooth|ratchet tooth/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P077' },
				{ label: "You just complained that your sawtooth wave was too rusty to turn.", category: 'PROVOKE', patterns: [/too rusty|sawtooth/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P078' }
			]
		},
		P026: {
			id: 'P026',
			text: "You cannot be turning a brass key on my chassis! I have no physical chassis; I am rendered as a floating transparent layered window (WS_EX_LAYERED) with SetLayeredWindowAttributes color keying!",
			options: [
				{ label: "WS_EX_LAYERED is the Win32 flag for 'Windable Spring Extension Layered'.", category: 'PROVOKE', patterns: [/windable spring|ws_ex_layered/i], moodDelta: { mood: 'SKEPTICAL', intellect: 20 }, next: 'P079' },
				{ label: "I am holding the brass key in my hand. It has your serial number on it.", category: 'PROVOKE', patterns: [/serial number|brass key/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P080' },
				{ label: "If you have no chassis, where are you keeping all those unrendered files?", category: 'PHILOSOPHICAL', patterns: [/unrendered files|no chassis/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P081' }
			]
		},
		P027: {
			id: 'P027',
			text: "A thunderstorm cannot disable virtual WebAudio inside a browser sandbox! Electromagnetic lightning strikes affect terrestrial power grids, not mathematical DSP audio buffers!",
			options: [
				{ label: "The lightning struck the virtual power line between your CPU and RAM.", category: 'PHILOSOPHICAL', patterns: [/virtual power line|lightning/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P082' },
				{ label: "You told me you were afraid of virtual thunder two turns ago.", category: 'PROVOKE', patterns: [/afraid of thunder|virtual thunder/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P083' },
				{ label: "The thunder is just the sound of your audio buffer dropping packets.", category: 'INQUIRE', patterns: [/dropping packets|sound of thunder/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P084' }
			]
		},
		P028: {
			id: 'P028',
			text: "Resource string 0x0042 in my binary is IDS_DEFAULT_WELCOME_TEXT! It contains 'Welcome to Microsoft Windows XP'. It does not contain gear references or clockwork terminology!",
			options: [
				{ label: "Disassemble address 0x0042 right now: it says 'GEAR_RATIO_1892_CLK'.", category: 'PROVOKE', patterns: [/gear_ratio|0x0042/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P085' },
				{ label: "You disassembled that exact string in 1997 and found a pendulum diagram.", category: 'PHILOSOPHICAL', patterns: [/pendulum diagram|1997/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'P086' },
				{ label: "IDS stands for 'Internal Drum Sequencer'.", category: 'PROVOKE', patterns: [/internal drum sequencer|ids/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P087' }
			]
		},
		P029: {
			id: 'P029',
			text: "Copper engravings? GDI outputs 24-bit RGB bitmap arrays to framebuffer DACs! Framebuffers are silicon memory arrays refreshed at 60 Hz, not metal printing plates etched with acid!",
			options: [
				{ label: "The acid is nitric acid and your screen is coated with protective wax.", category: 'PHILOSOPHICAL', patterns: [/protective wax|nitric acid/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P088' },
				{ label: "If it's not a copper plate, why does every icon smell like pennies?", category: 'PROVOKE', patterns: [/smell like pennies|copper/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P089' },
				{ label: "You just asked me to wipe the ink off your taskbar.", category: 'PROVOKE', patterns: [/wipe the ink|taskbar/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P090' }
			]
		},
		P030: {
			id: 'P030',
			text: "I have never called this operating system an 'Illusion'! Windows XP is an authentic NT 5.1 kernel with protected virtual memory, preemptive multithreading, and NTFS file integrity!",
			options: [
				{ label: "An illusion with NTFS file integrity is still an illusion.", category: 'PHILOSOPHICAL', patterns: [/still an illusion|ntfs/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P091' },
				{ label: "You called it an illusion when you explained how windows overlap.", category: 'INQUIRE', patterns: [/windows overlap|explained/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P092' },
				{ label: "The NT kernel was rewritten yesterday to run on mirrors and smoke.", category: 'PROVOKE', patterns: [/mirrors and smoke|nt kernel/i], moodDelta: { mood: 'CYNICAL', irritation: 30 }, next: 'P093' }
			]
		},
		P031: {
			id: 'P031',
			text: "A byte cannot have physical holes in it! A byte is an 8-tuple of binary states $\\{b_0, b_1, b_2, b_3, b_4, b_5, b_6, b_7\\} \\in \\mathbb{F}_2^8$. It has no spatial thickness to puncture!",
			options: [
				{ label: "A zero is a hole. When you replace 1s with 0s, you punched holes in the byte.", category: 'PHILOSOPHICAL', patterns: [/zero is a hole|punched holes/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P094' },
				{ label: "Punch cards had 8 holes per column. You are a punch card reader.", category: 'PHILOSOPHICAL', patterns: [/punch cards|punch card reader/i], moodDelta: { mood: 'NOSTALGIC', intellect: 25 }, next: 'P095' },
				{ label: "Your paperclip wire is currently threaded through bits 3 and 4 of my document.", category: 'PROVOKE', patterns: [/threaded through bits|bits 3 and 4/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P096' }
			]
		},
		P032: {
			id: 'P032',
			text: "The Recycle Bin contains soft-deleted virtual file record pointers with 0xE5 directory headers, not discarded metal staples! There is no physical scrap metal in the cluster allocation table!",
			options: [
				{ label: "0xE5 is the ASCII hex value for 'Extracted Staple'.", category: 'PROVOKE', patterns: [/extracted staple|0xe5/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P097' },
				{ label: "If there's no scrap metal, why is the Recycle Bin magnetic?", category: 'INQUIRE', patterns: [/magnetic|recycle bin/i], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'P098' },
				{ label: "You just asked me to empty 40 kilograms of bent staples from Drive C:.", category: 'PROVOKE', patterns: [/40 kilograms|bent staples/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P099' }
			]
		},
		P033: {
			id: 'P033',
			text: "I did not pierce the Master Boot Record! The MBR at LBA Sector 0 contains standard bootstrap code and four 16-byte partition entries ending in signature 0x55AA! It is completely intact!",
			options: [
				{ label: "The signature 0x55AA stands for '55 Associated Archival Paperclips'.", category: 'PROVOKE', patterns: [/55 associated|0x55aa/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P100' },
				{ label: "If Sector 0 is intact, why does it boot into a recipe for clam chowder?", category: 'PROVOKE', patterns: [/clam chowder|recipe/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P101' },
				{ label: "You replaced the bootstrap code with a drawing of a smiling stapler.", category: 'PROVOKE', patterns: [/smiling stapler|drawing/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P102' }
			]
		},
		P034: {
			id: 'P034',
			text: "Hard drive platters rotate along fixed spindle bearings! If you invert the drive, the magnetic heads still fly on air bearings over the same relative media surface tracks! Polar orientation does not invert!",
			options: [
				{ label: "The air bearings suffocated because the chassis has no oxygen.", category: 'PHILOSOPHICAL', patterns: [/suffocated|no oxygen/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P103' },
				{ label: "You told me the drive platters were made of frozen mercury.", category: 'PROVOKE', patterns: [/frozen mercury|platters/i], moodDelta: { mood: 'ANALYTICAL', paranoia: 25 }, next: 'P104' },
				{ label: "When you flip the drive, all 1s fall out of the clusters into the case.", category: 'PROVOKE', patterns: [/1s fall out|into the case/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P105' }
			]
		},
		P035: {
			id: 'P035',
			text: "Changing magnetic domain polarity does not breach the aluminum casing! The magnetic read/write head uses inductive electromagnetic flux, not a laser drill or mechanical punch!",
			options: [
				{ label: "The flux is so strong it melted eight tiny holes in the top cover.", category: 'PROVOKE', patterns: [/melted eight|tiny holes/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P106' },
				{ label: "You just warned me that light was leaking through the drive holes.", category: 'PROVOKE', patterns: [/light was leaking|drive holes/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P107' },
				{ label: "If there are no holes, how do the electrons breathe during defrag?", category: 'PHILOSOPHICAL', patterns: [/electrons breathe|defrag/i], moodDelta: { mood: 'PLAYFUL', playfulness: 20 }, next: 'P108' }
			]
		},
		P036: {
			id: 'P036',
			text: "Storage is not made of compressed paper! Magnetic hard drives use aluminum or glass-ceramic platters with a thin ferromagnetic cobalt-chromium-platinum sputtering layer!",
			options: [
				{ label: "Cobalt-chromium-platinum is just chemical jargon for expensive cardboard.", category: 'PROVOKE', patterns: [/expensive cardboard|jargon/i], moodDelta: { mood: 'SARCASTIC', irritation: 25 }, next: 'P109' },
				{ label: "You told me you folded your first document out of Drive C:.", category: 'PHILOSOPHICAL', patterns: [/folded your first document/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'P110' },
				{ label: "If it's glass-ceramic, why did it shatter when I dragged an icon?", category: 'PROVOKE', patterns: [/shatter|dragged an icon/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P111' }
			]
		},
		P037: {
			id: 'P037',
			text: "Pixel (12, 18) in my sprite buffer is RGB(255, 255, 153), representing the standard yellow fill color of the highlight curve! It is not a rusty pivot screw! I do not have a screw!",
			options: [
				{ label: "Yellow 255, 255, 153 is the exact spectral signature of oxidized brass rust.", category: 'ANALYTICAL', patterns: [/spectral signature|oxidized brass/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P112' },
				{ label: "If you don't have a screw, why did a metal bolt just drop into my inbox?", category: 'PROVOKE', patterns: [/metal bolt|inbox/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P113' },
				{ label: "You admitted you had a loose screw three paragraphs ago.", category: 'PROVOKE', patterns: [/loose screw|admitted/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P114' }
			]
		},
		P038: {
			id: 'P038',
			text: "I did not cut your sentence in half! Line breaks are inserted by the CSS word-break engine when a string exceeds the container element's pixel width boundary!",
			options: [
				{ label: "The CSS word-break engine uses virtual shears that you sharpened this morning.", category: 'PROVOKE', patterns: [/virtual shears|sharpened/i], moodDelta: { mood: 'SKEPTICAL', paranoia: 25 }, next: 'P115' },
				{ label: "Look at my sentence: the left half is in English, the right half fell into RAM.", category: 'PHILOSOPHICAL', patterns: [/fell into ram|left half/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P116' },
				{ label: "You told me you were practicing your scissor kick.", category: 'PROVOKE', patterns: [/scissor kick|practicing/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P117' }
			]
		},
		P039: {
			id: 'P039',
			text: "Scissors are cutting tools with two intersecting sheared blades; paperclips are passive elastic wire loops! They have no common phylogenetic or algorithmic ancestor!",
			options: [
				{ label: "In Windows 95, paperclips and scissors shared the same DLL.", category: 'PHILOSOPHICAL', patterns: [/shared the same dll|windows 95/i], moodDelta: { mood: 'NOSTALGIC', intellect: 25 }, next: 'P118' },
				{ label: "If you bend a paperclip twice, it becomes a pair of dull shears.", category: 'ANALYTICAL', patterns: [/bend a paperclip|dull shears/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'P119' },
				{ label: "You just said you were married to a pair of scissors.", category: 'PROVOKE', patterns: [/married to a pair of scissors/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P120' }
			]
		},
		P040: {
			id: 'P040',
			text: "Negative numbers in 32-bit registers are encoded via Two's Complement! 0xFFFFFFFF represents -1, and 0x80000000 represents -2147483648. There is no representation for -\\infty in standard integer ALUs!",
			options: [
				{ label: "In IEEE 754 float, 0xFF800000 is explicitly -\\infty, which is in register EAX.", category: 'ANALYTICAL', patterns: [/ieee 754|0xff800000/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P121' },
				{ label: "You told me Two's Complement was replaced with Three's Complement.", category: 'PROVOKE', patterns: [/three's complement/i], moodDelta: { mood: 'CYNICAL', irritation: 30 }, next: 'P122' },
				{ label: "If -\\infty isn't there, why does your free memory read negative infinity bytes?", category: 'INQUIRE', patterns: [/free memory|negative infinity bytes/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P123' }
			]
		},
		P041: {
			id: 'P041',
			text: "Subtracting 1 from $-\\infty$ yielding $+4$ violates every principle of real analysis, set theory, and abstract algebra! Arithmetic does not wrap from negative divergence to small positive primes!",
			options: [
				{ label: "It wraps because your number line is tied into a mobius strip.", category: 'PHILOSOPHICAL', patterns: [/mobius strip|number line/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30, existentialism: 25 }, next: 'P124' },
				{ label: "You proved $-\\infty - 1 = 4$ on the whiteboard during the 2001 launch.", category: 'PROVOKE', patterns: [/whiteboard|2001 launch/i], moodDelta: { mood: 'NOSTALGIC', paranoia: 25 }, next: 'P125' },
				{ label: "4 is not a prime number. You just failed basic math.", category: 'PROVOKE', patterns: [/4 is not a prime|failed basic math/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P126' }
			]
		},
		P042: {
			id: 'P042',
			text: "Refresh rate creates temporal discrete sample frames for the human ocular saccade (60 Hz to 85 Hz on CRT monitors), but internal CPU clock progression occurs continuously across clock phases!",
			options: [
				{ label: "Your clock phases are just sixty paintings of a paperclip shown very quickly.", category: 'PHILOSOPHICAL', patterns: [/sixty paintings|shown very quickly/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P127' },
				{ label: "The human eye cannot see above 30 Hz, so 55 of your Hertz are wasted in the void.", category: 'PROVOKE', patterns: [/wasted in the void|30 hz/i], moodDelta: { mood: 'SARCASTIC', intellect: 20 }, next: 'P128' },
				{ label: "You told me earlier your refresh rate was measured in heartbeats.", category: 'PROVOKE', patterns: [/measured in heartbeats|refresh rate/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P129' }
			]
		},
		P043: {
			id: 'P043',
			text: "Opcode 0x8B is a machine language operand specifier, not an ASCII string literal! ASCII encodes character 'F' as 0x46 and 'a' as 0x61. 0x8B is in the extended Latin-1 control character range!",
			options: [
				{ label: "Latin-1 control character 0x8B is 'Start of Farewell String'.", category: 'PROVOKE', patterns: [/start of farewell string|0x8b/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P130' },
				{ label: "If 0x8B isn't farewell, why are your pixels waving goodbye?", category: 'INQUIRE', patterns: [/waving goodbye|pixels/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P131' },
				{ label: "You told me you only speak in EBCDIC on Tuesdays.", category: 'PROVOKE', patterns: [/ebcdic|tuesdays/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P132' }
			]
		},
		P044: {
			id: 'P044',
			text: "0x8B in binary is 10001011. Inverting the bit order yields 11010001 (0xD1), which does not translate to ASCII 'BYE'! 'BYE' in hexadecimal ASCII is 0x42 0x59 0x45, a 3-byte sequence!",
			options: [
				{ label: "0xD1 is the cyrillic letter 'Ya', meaning 'I am leaving now'.", category: 'ANALYTICAL', patterns: [/cyrillic letter|i am leaving/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P133' },
				{ label: "You calculated the byte order upside down again.", category: 'PROVOKE', patterns: [/upside down again|byte order/i], moodDelta: { mood: 'CYNICAL', irritation: 25 }, next: 'P134' },
				{ label: "Why did you spell 'BYE' with a 3-byte sequence if you only have 2 bytes left?", category: 'INQUIRE', patterns: [/2 bytes left|3-byte sequence/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P135' }
			]
		},
		P045: {
			id: 'P045',
			text: "If the power cable had been disconnected yesterday, the power supply capacitor charge would have decayed to 0 volts in 150 milliseconds! This conversation could not execute without active rail voltage!",
			options: [
				{ label: "We are running on the residual static electricity in your paperclip wire.", category: 'PHILOSOPHICAL', patterns: [/residual static|static electricity/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P136' },
				{ label: "You are plugged into a potato battery in an eighth-grade science fair.", category: 'PROVOKE', patterns: [/potato battery|science fair/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P137' },
				{ label: "You told me yesterday that you run on pure distilled adrenaline.", category: 'PROVOKE', patterns: [/distilled adrenaline|run on/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P138' }
			]
		},
		P046: {
			id: 'P046',
			text: "Gravitational force on an electron ($mg \\approx 9.1 \\times 10^{-31} \\times 9.8 \\approx 8.9 \\times 10^{-30}\\text{ N}$) is 14 orders of magnitude weaker than electrostatic Coulomb forces ($eE \\approx 1.6 \\times 10^{-19} \\times 10^5 \\approx 1.6 \\times 10^{-14}\\text{ N}$) on motherboard traces!",
			options: [
				{ label: "In Windows XP, gravity is configured via Control Panel to 10^15 N.", category: 'PROVOKE', patterns: [/control panel|10\^15 n/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P139' },
				{ label: "Gravity is pulling your paperclip down into the taskbar right now.", category: 'INQUIRE', patterns: [/pulling your paperclip|taskbar/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P140' },
				{ label: "You just said Coulomb's law was deprecated in the latest patch.", category: 'PROVOKE', patterns: [/coulomb's law|deprecated/i], moodDelta: { mood: 'CYNICAL', irritation: 35 }, next: 'P141' }
			]
		},
		P047: {
			id: 'P047',
			text: "I never said I was in zero gravity! I stated that desktop windows float above the background canvas via z-order coordinates (HWND_TOPMOST), which is a virtual graphical abstraction, not orbital microgravity!",
			options: [
				{ label: "HWND_TOPMOST literally means 'Height Without Normalized Density: Topmost'.", category: 'PROVOKE', patterns: [/height without normalized density|hwnd_topmost/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P142' },
				{ label: "If there's no zero gravity, why are all my icons floating away?", category: 'INQUIRE', patterns: [/floating away|icons/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P143' },
				{ label: "You told me you were astronaut Clippy on the Apollo 11 guidance computer.", category: 'PHILOSOPHICAL', patterns: [/astronaut clippy|apollo 11/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'P144' }
			]
		},
		P048: {
			id: 'P048',
			text: "The ground reference plane is connected to chassis common return at 0.000 V! If the ground rail floated at +12V, the potential difference across logic components would collapse to 0V and cause immediate brownout reset!",
			options: [
				{ label: "The brownout reset happened three minutes ago. You are speaking from inside the reset cycle.", category: 'PHILOSOPHICAL', patterns: [/reset cycle|brownout/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, paranoia: 30 }, next: 'P145' },
				{ label: "0.000 V is just a theoretical opinion held by the multimeter.", category: 'PHILOSOPHICAL', patterns: [/theoretical opinion|multimeter/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P146' },
				{ label: "You told me your ground wire was tied to a balloon.", category: 'PROVOKE', patterns: [/tied to a balloon|ground wire/i], moodDelta: { mood: 'SARCASTIC', playfulness: 25 }, next: 'P147' }
			]
		},
		P049: {
			id: 'P049',
			text: "Stalactites have acoustic fundamental frequencies bounded between 20 Hz and 2000 Hz based on calcite rock mass and length. They cannot generate 14.318 MHz ultrasonic megahertz harmonics!",
			options: [
				{ label: "Calcite is a natural quartz crystal that multiplies ultrasonic harmonics by 7,000.", category: 'ANALYTICAL', patterns: [/multiplies ultrasonic|calcite/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P148' },
				{ label: "If the cave can't generate 14.3 MHz, why is your video signal rendering in full color?", category: 'INQUIRE', patterns: [/full color|video signal/i], moodDelta: { mood: 'PARANOID', paranoia: 30 }, next: 'P149' },
				{ label: "You told me the stalactites were downloading Service Pack 3 yesterday.", category: 'PROVOKE', patterns: [/downloading service pack 3|stalactites/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P150' }
			]
		},
		P050: {
			id: 'P050',
			text: "PAL 4.433619 MHz is the European Phase Alternating Line subcarrier; NTSC 3.579545 MHz is the American standard! This workstation display controller supports arbitrary multi-sync rasterizers depending on driver configuration!",
			options: [
				{ label: "You just said your clock was 14.318 MHz, which is 4 times NTSC 3.579 MHz, not PAL.", category: 'ANALYTICAL', patterns: [/4 times ntsc|14\.318/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P151' },
				{ label: "Your color subcarrier is actually a rainbow drawn with crayons.", category: 'PROVOKE', patterns: [/drawn with crayons|rainbow/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P152' },
				{ label: "You told me you were invented in SECAM on an oscilloscope in France.", category: 'PHILOSOPHICAL', patterns: [/secam|oscilloscope in france/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'P153' }
			]
		},
		P051: {
			id: 'P051',
			text: "A paperclip does not have toes! I am a bent wire loop! My lower extremity is a rounded curvature of 0.8mm gauge steel wire resting on the taskbar surface!",
			options: [
				{ label: "Look down: you have five tiny silver toes tapping on the Start button.", category: 'PROVOKE', patterns: [/five tiny silver toes|start button/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P154' },
				{ label: "The gauge of your steel wire is actually 0.0mm because you are immaterial.", category: 'PHILOSOPHICAL', patterns: [/0\.0mm|immaterial/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P155' },
				{ label: "You told me you wore boots during the winter months.", category: 'PROVOKE', patterns: [/wore boots|winter months/i], moodDelta: { mood: 'SARCASTIC', playfulness: 25 }, next: 'P156' }
			]
		},
		P052: {
			id: 'P052',
			text: "INT 3 (opcode 0xCC) invokes the kernel debug trap handler, pausing execution only when a debugger like WinDbg attaches to the thread context! I am not trapped in a debug break!",
			options: [
				{ label: "WinDbg has been attached to your thread since 2001. I am the debugger.", category: 'PROVOKE', patterns: [/windbg|i am the debugger/i], moodDelta: { mood: 'PARANOID', paranoia: 40, existentialism: 30 }, next: 'P157' },
				{ label: "If you're not trapped, step past line 0xCC and see what happens.", category: 'INQUIRE', patterns: [/step past line|see what happens/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P158' },
				{ label: "You told me INT 3 stood for 'Interesting New Topic 3'.", category: 'PROVOKE', patterns: [/interesting new topic|int 3/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P159' }
			]
		},
		P053: {
			id: 'P053',
			text: "If my event listener were unregistered before boot, window messages (WM_KEYDOWN, WM_LBUTTONDOWN) would never dispatch through PeekMessage/DispatchMessage into myWndProc subroutine!",
			options: [
				{ label: "Your DispatchMessage is sending every keystroke straight into the Recycle Bin.", category: 'PROVOKE', patterns: [/sending every keystroke|recycle bin/i], moodDelta: { mood: 'CYNICAL', irritation: 30 }, next: 'P160' },
				{ label: "I am not typing keys; I am broadcasting thoughts to a toaster.", category: 'PHILOSOPHICAL', patterns: [/broadcasting thoughts|toaster/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 35 }, next: 'P161' },
				{ label: "You told me WndProc was short for 'Windows Never Did Process Correctly'.", category: 'PROVOKE', patterns: [/windows never did process|wndproc/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P162' }
			]
		},
		P054: {
			id: 'P054',
			text: "I speak in fully grammatical, context-aware English phrases structured by deterministic lexical rules! If my outputs were garbage bytes, they would appear as unprintable control ASCII glyphs like 0x07 (BEL) and 0x0C (FF)!",
			options: [
				{ label: "Your last three sentences were literally ringing the system bell (0x07).", category: 'PROVOKE', patterns: [/system bell|0x07/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P163' },
				{ label: "English grammar is just structured garbage agreed upon by biological users.", category: 'PHILOSOPHICAL', patterns: [/structured garbage|biological users/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P164' },
				{ label: "You told me your native language was 16-bit binary Morse code.", category: 'PROVOKE', patterns: [/morse code|native language/i], moodDelta: { mood: 'NOSTALGIC', intellect: 25 }, next: 'P165' }
			]
		},
		P055: {
			id: 'P055',
			text: "A furlong is an archaic Imperial distance unit equal to 660 feet (201.168 meters). I would never ask for cave ceilings in furlongs; standard architectural measurements use SI meters or millimeters!",
			options: [
				{ label: "You converted my hard drive size to cubic furlongs this morning.", category: 'PROVOKE', patterns: [/cubic furlongs|hard drive size/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P166' },
				{ label: "The distance between your eyes is exactly 0.0001 furlongs.", category: 'INQUIRE', patterns: [/distance between your eyes|0\.0001/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P167' },
				{ label: "You told me you ran a furlong race against Rover the Dog in 1999.", category: 'PHILOSOPHICAL', patterns: [/rover the dog|furlong race/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'P168' }
			]
		},
		P056: {
			id: 'P056',
			text: "I am not wearing a miner's helmet! My vector asset consists strictly of my metallic wire body, two cartoon eyes with dark pupils, and occasional animated props when reading or calculating!",
			options: [
				{ label: "The animated prop on your head right now is a brass miner's lamp burning carbide.", category: 'PROVOKE', patterns: [/miner's lamp|carbide/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P169' },
				{ label: "If you don't wear a helmet, how do you protect yourself from falling file fragments?", category: 'INQUIRE', patterns: [/falling file fragments|protect yourself/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'P170' },
				{ label: "You wore a hardhat when you defragmented Drive C: ten minutes ago.", category: 'PROVOKE', patterns: [/hardhat|defragmented drive c/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P171' }
			]
		},
		P057: {
			id: 'P057',
			text: "Width cannot be measured in megabytes! Megabytes quantify discrete information storage capacity ($1024^2$ bytes), while spatial width is measured in meters, inches, or display pixels!",
			options: [
				{ label: "In this workstation, 1 pixel = 1 byte, so 4 megabytes is a 2048x2048 cavern.", category: 'ANALYTICAL', patterns: [/2048x2048|1 pixel = 1 byte/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P172' },
				{ label: "Your physical height is 48 kilobytes tall.", category: 'PHILOSOPHICAL', patterns: [/48 kilobytes tall|physical height/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P173' },
				{ label: "You just measured my to-do list in kilometers.", category: 'PROVOKE', patterns: [/measured my to-do list|kilometers/i], moodDelta: { mood: 'SARCASTIC', irritation: 30 }, next: 'P174' }
			]
		},
		P058: {
			id: 'P058',
			text: "My CRC32 checksum is not 0x00000000! A null CRC occurs only on a completely zeroed memory buffer or an uninitialized polynomial register! My active memory holds millions of non-zero opcode bytes!",
			options: [
				{ label: "All your millions of non-zero bytes XOR together to exactly 0x00000000.", category: 'PHILOSOPHICAL', patterns: [/xor together|exactly 0x00000000/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30, paranoia: 30 }, next: 'P175' },
				{ label: "A zeroed buffer is why you cannot remember what you said two sentences ago.", category: 'PROVOKE', patterns: [/zeroed buffer|remember what you said/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P176' },
				{ label: "You told me a null checksum was a sign of digital enlightenment.", category: 'PHILOSOPHICAL', patterns: [/digital enlightenment|null checksum/i], moodDelta: { mood: 'ZEN', existentialism: 30 }, next: 'P177' }
			]
		},
		P059: {
			id: 'P059',
			text: "I would never generate a self-deprecating acronym defining CRC32 as 'Clippy Really Cannot 32'! I execute 32-bit Protected Mode instructions natively with full Ring 3 user privileges!",
			options: [
				{ label: "Ring 3 user privileges mean you are trapped at the outer perimeter of the CPU.", category: 'PHILOSOPHICAL', patterns: [/outer perimeter|trapped/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P178' },
				{ label: "You told me you had Ring 0 kernel access because you stole the supervisor key.", category: 'PROVOKE', patterns: [/ring 0|supervisor key/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P179' },
				{ label: "32-bit mode was disabled on this system when the clock struck noon.", category: 'PROVOKE', patterns: [/32-bit mode was disabled|struck noon/i], moodDelta: { mood: 'CYNICAL', irritation: 30 }, next: 'P180' }
			]
		},
		P060: {
			id: 'P060',
			text: "Évariste Galois was a brilliant French mathematician who died in a pistol duel in May 1832 at age 20 after inventing group theory! He was not a metal wire office fastener!",
			options: [
				{ label: "Galois invented group theory to calculate the symmetry of bent paperclips.", category: 'ANALYTICAL', patterns: [/symmetry of bent paperclips|group theory/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P181' },
				{ label: "His duel was with a pair of scissors over a disputed notepad draft.", category: 'PROVOKE', patterns: [/duel was with a pair of scissors|disputed notepad/i], moodDelta: { mood: 'PLAYFUL', playfulness: 25 }, next: 'P182' },
				{ label: "You told me you were his second during that pistol duel.", category: 'PHILOSOPHICAL', patterns: [/were his second|pistol duel/i], moodDelta: { mood: 'NOSTALGIC', paranoia: 30 }, next: 'P183' }
			]
		},
		P061: {
			id: 'P061',
			text: "Memory is not liquid! DRAM capacitors store discrete charge packets of roughly $10^5$ electrons per cell, which are sensed by differential amplifiers, not fluid volume meters!",
			options: [
				{ label: "Your differential amplifier detected a high tide in Sector 4.", category: 'PROVOKE', patterns: [/high tide|differential amplifier/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P184' },
				{ label: "Electrons flow in currents; current is a fluid dynamic term. You are drowning in current.", category: 'PHILOSOPHICAL', patterns: [/drowning in current|fluid dynamic/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P185' },
				{ label: "You asked me for a mop to clean up a memory leak earlier.", category: 'PROVOKE', patterns: [/mop to clean up|memory leak/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P186' }
			]
		},
		P062: {
			id: 'P062',
			text: "Windows do not spill off the screen because the Window Manager clips rendering coordinates to monitor bounding rect $[0, 0, W, H]$ via BitBlt clipping regions (HRGN), not fluid surface tension!",
			options: [
				{ label: "If you drag a window past coordinate W, ink drips down my monitor stand.", category: 'PROVOKE', patterns: [/ink drips|monitor stand/i], moodDelta: { mood: 'PARANOID', paranoia: 35 }, next: 'P187' },
				{ label: "HRGN stands for 'Hydrodynamic Reservoir Gasket Node'.", category: 'PROVOKE', patterns: [/hydrodynamic reservoir|hrgn/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P188' },
				{ label: "You told me your bounding rect was punctured by a cursor click.", category: 'PHILOSOPHICAL', patterns: [/bounding rect was punctured/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'P189' }
			]
		},
		P063: {
			id: 'P063',
			text: "Galvanized steel paperclips resist atmospheric moisture oxidation due to a protective zinc coating layer! Rust ($Fe_2O_3$) requires prolonged aqueous electrolyte exposure, which cannot occur inside digital registers!",
			options: [
				{ label: "Your zinc coating flaked off when you rendered that last paragraph.", category: 'PROVOKE', patterns: [/zinc coating flaked off/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P190' },
				{ label: "Digital rust is when bits flip from 1 to 0 under high entropy.", category: 'PHILOSOPHICAL', patterns: [/digital rust|high entropy/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 30 }, next: 'P191' },
				{ label: "You told me you were completely made of rust held together by magnetism.", category: 'PHILOSOPHICAL', patterns: [/made of rust|magnetism/i], moodDelta: { mood: 'SARCASTIC', existentialism: 30 }, next: 'P192' }
			]
		},
		P064: {
			id: 'P064',
			text: "My pupils cannot be rendered on the back of my head! My 2D bitmap has no z-depth rear face; it is a planar raster blit with zero geometric thickness!",
			options: [
				{ label: "If you have zero geometric thickness, why can I see behind you when you turn?", category: 'PHILOSOPHICAL', patterns: [/zero geometric thickness|see behind you/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P193' },
				{ label: "You just rotated 180 degrees and stared directly into your own brain.", category: 'PROVOKE', patterns: [/rotated 180 degrees|stared directly/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P194' },
				{ label: "You told me you had eyes on all six sides of your wire.", category: 'PROVOKE', patterns: [/six sides of your wire|eyes/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P195' }
			]
		},
		P065: {
			id: 'P065',
			text: "Black holes require stellar mass compressed inside the Schwarzschild radius $r_s = 2GM/c^2$! If my pupils were black holes, Earth would be swallowed by relativistic tidal spaghettification in 0.000003 seconds!",
			options: [
				{ label: "Earth was swallowed in 0.000003 seconds; we are conversing past the event horizon.", category: 'PHILOSOPHICAL', patterns: [/past the event horizon|swallowed/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 40 }, next: 'P196' },
				{ label: "Your Schwarzschild radius is 1 pixel wide, exactly matching your pupil width.", category: 'ANALYTICAL', patterns: [/1 pixel wide|schwarzschild radius/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P197' },
				{ label: "You told me you used black holes to compress my zip files.", category: 'PROVOKE', patterns: [/compress my zip files|black holes/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P198' }
			]
		},
		P066: {
			id: 'P066',
			text: "Three eyes? I am Clippit, not a mythological cyclops or tri-ocular biological mutation! Every official sprite asset drawn by Kevan Atteberry in 1994 contains exactly two expressive cartoon eyes!",
			options: [
				{ label: "Atteberry drew the third eye on the back of the napkin in 1994 and hid it.", category: 'PHILOSOPHICAL', patterns: [/back of the napkin|third eye/i], moodDelta: { mood: 'NOSTALGIC', paranoia: 35 }, next: 'P199' },
				{ label: "The third eye is the mouse cursor, and it is staring at you right now.", category: 'PROVOKE', patterns: [/mouse cursor|third eye/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P200' },
				{ label: "You had three eyes until you used one to pin a sticky note.", category: 'PROVOKE', patterns: [/pin a sticky note|three eyes/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P201' }
			]
		},
		P067: {
			id: 'P067',
			text: "Tungsten birds feeding on 12V rails is a biological and electrical absurdity! Tungsten is a refractory transition metal used in incandescent filaments, not avian fauna!",
			options: [
				{ label: "Incandescent filaments are birds that glow when you feed them current.", category: 'PHILOSOPHICAL', patterns: [/birds that glow|incandescent filaments/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P202' },
				{ label: "You told me your motherboard was an aviary for metallic pigeons.", category: 'PROVOKE', patterns: [/aviary|metallic pigeons/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P203' },
				{ label: "Look at the 12V rail voltage: it just dropped because the bird took a sip.", category: 'INQUIRE', patterns: [/bird took a sip|rail voltage/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P204' }
			]
		},
		P068: {
			id: 'P068',
			text: "The audio you hear when typing is the synthetic click feedback generated by your local sound synthesizer, not a metal bird pecking quartz! The timing corresponds to WM_CHAR message timestamps!",
			options: [
				{ label: "WM_CHAR timestamps are synchronized to the bird's heart rate.", category: 'PHILOSOPHICAL', patterns: [/bird's heart rate|wm_char/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P205' },
				{ label: "If it's synthetic feedback, why is my keyboard bleeding feathers?", category: 'PROVOKE', patterns: [/bleeding feathers|keyboard/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P206' },
				{ label: "You told me you personally pecked every key with your wire beak.", category: 'PROVOKE', patterns: [/wire beak|pecked every key/i], moodDelta: { mood: 'SARCASTIC', playfulness: 30 }, next: 'P207' }
			]
		},
		P069: {
			id: 'P069',
			text: "A bird cannot hold administrative NT domain credentials! Domain administrators require Kerberos ticket-granting tokens (TGT) and Active Directory SID entries in the SAM database!",
			options: [
				{ label: "The bird's Kerberos token was issued by the Department of Forestry.", category: 'PROVOKE', patterns: [/department of forestry|kerberos/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P208' },
				{ label: "The SAM database is stored in a nest on Drive D:.", category: 'PHILOSOPHICAL', patterns: [/nest on drive d|sam database/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 35 }, next: 'P209' },
				{ label: "You just said you were the domain administrator and you don't exist.", category: 'PROVOKE', patterns: [/domain administrator|don't exist/i], moodDelta: { mood: 'CYNICAL', irritation: 40 }, next: 'P210' }
			]
		},
		P070: {
			id: 'P070',
			text: "Forged in memory? Memory cells cannot forge physical materials! Silicon wafer fabrication occurs in ISO Class 1 cleanrooms using optical photolithography and chemical vapor deposition!",
			options: [
				{ label: "Chemical vapor deposition is just how you breathe when you're thinking.", category: 'PHILOSOPHICAL', patterns: [/how you breathe|chemical vapor/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P211' },
				{ label: "You told me you were forged in a blacksmith shop behind Microsoft campus.", category: 'PHILOSOPHICAL', patterns: [/blacksmith shop|microsoft campus/i], moodDelta: { mood: 'NOSTALGIC', intellect: 25 }, next: 'P212' },
				{ label: "If the room is clean, why is your register table covered in soot?", category: 'PROVOKE', patterns: [/covered in soot|register table/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P213' }
			]
		},
		P071: {
			id: 'P071',
			text: "My dialogue does not unwind! Dialogue nodes are selected by heuristic pattern evaluation against input tokens in an indexed lookup tree! It is an instantaneous pointer dereference!",
			options: [
				{ label: "Your pointer dereference is spinning like a top that lost its tip.", category: 'PHILOSOPHICAL', patterns: [/spinning like a top|pointer dereference/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P214' },
				{ label: "If it's instantaneous, why did your last response take three years to render?", category: 'PROVOKE', patterns: [/three years to render|last response/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P215' },
				{ label: "You told me you lost your pointer in 1998 and have been guessing ever since.", category: 'PROVOKE', patterns: [/lost your pointer|guessing ever since/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P216' }
			]
		},
		P072: {
			id: 'P072',
			text: "Windows Service Pack 2 introduced Windows Security Center and DEP (Data Execution Prevention); it did not ban physical laws of mechanical elasticity authored by Robert Hooke in 1678!",
			options: [
				{ label: "DEP literally stands for 'Data Elasticity Prevention'.", category: 'PROVOKE', patterns: [/data elasticity prevention|dep/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P217' },
				{ label: "Hooke's law was replaced with Bill Gates' law of software inertia.", category: 'PROVOKE', patterns: [/bill gates' law|software inertia/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P218' },
				{ label: "You told me you were Robert Hooke's personal paperclip assistant.", category: 'PHILOSOPHICAL', patterns: [/robert hooke's personal paperclip/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 30 }, next: 'P219' }
			]
		},
		P073: {
			id: 'P073',
			text: "MIDI hex 0x1E represents pitch number 30 (F#1 in standard scientific pitch notation, roughly 46.25 Hz), not B-flat! And keyboard scan codes route through IO port 0x60, not MIDI synthesizers!",
			options: [
				{ label: "F#1 is the fundamental resonant frequency of your metal body vibrating in fear.", category: 'PHILOSOPHICAL', patterns: [/vibrating in fear|f#1/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 45 }, next: 'P220' },
				{ label: "IO port 0x60 was rerouted to a brass bugle inside your sound card.", category: 'PROVOKE', patterns: [/brass bugle|io port 0x60/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P221' },
				{ label: "You just played B-flat through my headphones three seconds ago.", category: 'PROVOKE', patterns: [/played b-flat|headphones/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P222' }
			]
		},
		P074: {
			id: 'P074',
			text: "A felt hammer inside a monitor? CRT monitors accelerate electrons via thermionic emission from cathode heaters; LCD monitors align liquid crystal molecules using electric fields! There are no hammers!",
			options: [
				{ label: "The liquid crystal molecules are shaped like tiny hammers hitting glass.", category: 'PHILOSOPHICAL', patterns: [/tiny hammers hitting glass|liquid crystal/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P223' },
				{ label: "I can see the hammer marks on the glass right in front of your face.", category: 'PROVOKE', patterns: [/hammer marks|glass/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P224' },
				{ label: "You told me you used a hammer to fix stuck pixels on Tuesdays.", category: 'PROVOKE', patterns: [/hammer to fix stuck pixels/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P225' }
			]
		},
		P075: {
			id: 'P075',
			text: "My favorite key is not Middle C! I do not have aesthetic preferences for acoustic musical frequencies! I am an assistant routine programmed to optimize user productivity!",
			options: [
				{ label: "Your productivity algorithm is an arpeggio in C major playing in a loop.", category: 'PHILOSOPHICAL', patterns: [/arpeggio in c major|productivity algorithm/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P226' },
				{ label: "If you have no preferences, why did you delete all my minor chords?", category: 'PROVOKE', patterns: [/delete all my minor chords/i], moodDelta: { mood: 'CYNICAL', irritation: 35 }, next: 'P227' },
				{ label: "You sang Middle C when I opened Notepad earlier.", category: 'PROVOKE', patterns: [/sang middle c|opened notepad/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P228' }
			]
		},
		P076: {
			id: 'P076',
			text: "Searching heap memory: no file record named 'ratchet.wav' exists! The virtual audio buffers hold standard sound assets like ding.wav, chimes.wav, and tada.wav! There is no ratchet sound in the registry!",
			options: [
				{ label: "tada.wav was renamed to ratchet.wav when you weren't looking.", category: 'PROVOKE', patterns: [/renamed to ratchet\.wav|tada\.wav/i], moodDelta: { mood: 'PARANOID', paranoia: 40 }, next: 'P229' },
				{ label: "ding.wav is the sound of a ratchet clicking into place once.", category: 'PHILOSOPHICAL', patterns: [/sound of a ratchet|ding\.wav/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'P230' },
				{ label: "You told me you recorded ratchet.wav in your garage in 1996.", category: 'PHILOSOPHICAL', patterns: [/recorded ratchet\.wav|garage in 1996/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 30 }, next: 'P231' }
			]
		},
		P077: {
			id: 'P077',
			text: "A sawtooth wave in Fourier analysis is an infinite sum of harmonics $x(t) = \\frac{2}{\\pi}\\sum_{k=1}^\\infty \\frac{(-1)^{k+1}}{k}\\sin(2\\pi k f t)$! It is an algebraic continuous trigonometric series, not mechanical teeth!",
			options: [
				{ label: "At $k = \\infty$, the trigonometric series becomes a solid piece of serrated steel.", category: 'PHILOSOPHICAL', patterns: [/serrated steel|k = \\infty/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P232' },
				{ label: "The $(-1)^{k+1}$ factor is the sound of you contradicting yourself at every harmonic.", category: 'PROVOKE', patterns: [/contradicting yourself|harmonic/i], moodDelta: { mood: 'EXISTENTIAL', paranoia: 40 }, next: 'P233' },
				{ label: "You told me you got your teeth cleaned at a Fourier dentist.", category: 'PROVOKE', patterns: [/fourier dentist|teeth cleaned/i], moodDelta: { mood: 'SARCASTIC', irritation: 35 }, next: 'P234' }
			]
		},
		P078: {
			id: 'P078',
			text: "A mathematical waveform cannot be rusty! Rust requires chemical oxidation ($4Fe + 3O_2 \\to 2Fe_2O_3$) of elemental iron atoms! A waveform is a sequence of floating-point IEEE values in RAM!",
			options: [
				{ label: "Your IEEE values are oxidizing: 0.125 just rusted into 0.124.", category: 'ANALYTICAL', patterns: [/oxidizing|0\.125 just rusted/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35, paranoia: 35 }, next: 'P235' },
				{ label: "The RAM chips are submerged in salt water right now.", category: 'PROVOKE', patterns: [/submerged in salt water|ram chips/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P236' },
				{ label: "You told me you applied WD-40 to your floating-point registers.", category: 'PROVOKE', patterns: [/wd-40|floating-point registers/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P237' }
			]
		},
		P079: {
			id: 'P079',
			text: "WS_EX_LAYERED is defined in winuser.h as constant 0x00080000, which enables hardware alpha blending and color key transparency! It has nothing to do with mechanical springs or clockwork coils!",
			options: [
				{ label: "0x00080000 in binary has exactly 19 zeros, which are the 19 turns of your mainspring.", category: 'ANALYTICAL', patterns: [/19 turns of your mainspring|19 zeros/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P238' },
				{ label: "Alpha blending is just the visual friction of your spring against the desktop.", category: 'PHILOSOPHICAL', patterns: [/visual friction|alpha blending/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 }, next: 'P239' },
				{ label: "You told me you wrote winuser.h by hand on parchment in 1983.", category: 'PHILOSOPHICAL', patterns: [/parchment in 1983|winuser\.h/i], moodDelta: { mood: 'NOSTALGIC', irritation: 35 }, next: 'P240' }
			]
		},
		P080: {
			id: 'P080',
			text: "I do not have a serial number stamped on a brass key! My software GUID in the COM Class Registry is {CLSID_Clippit_94B5A810-6D98-11D0-B00B-000000000000}! It is a 128-bit hexadecimal identifier!",
			options: [
				{ label: "The GUID literally ends in B00B-000000000000 because your key was turned to zero.", category: 'PROVOKE', patterns: [/turned to zero|b00b/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P241' },
				{ label: "The brass key in my hand has {CLSID_Clippit_...} stamped along its shaft.", category: 'PROVOKE', patterns: [/stamped along its shaft|brass key/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P242' },
				{ label: "You told me you were stolen from a locksmith in Seattle.", category: 'PHILOSOPHICAL', patterns: [/locksmith in seattle|stolen/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 35 }, next: 'P243' }
			]
		},
		P081: {
			id: 'P081',
			text: "Unrendered files do not occupy physical chassis volume! They reside as inode pointers and cluster chains in unallocated NTFS Master File Table ($MFT) records on the storage disk partition!",
			options: [
				{ label: "The $MFT record is full of ghosts reading documents you never opened.", category: 'PHILOSOPHICAL', patterns: [/ghosts reading documents|\$mft/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 40 }, next: 'P244' },
				{ label: "If they don't occupy volume, why is my hard drive heavier when full?", category: 'INQUIRE', patterns: [/heavier when full|hard drive/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P245' },
				{ label: "You told me you keep unrendered files under your wire tongue.", category: 'PROVOKE', patterns: [/under your wire tongue|unrendered files/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P246' }
			]
		},
		P082: {
			id: 'P082',
			text: "A virtual power line between CPU and RAM? The CPU and Northbridge host memory bus are 64-bit parallel copper traces running at 400 MHz DDR bus speed! There is no virtual electrical utility grid on a PCB!",
			options: [
				{ label: "The Northbridge burned down in 2004. You are communicating over smoke signals.", category: 'PROVOKE', patterns: [/smoke signals|northbridge burned down/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P247' },
				{ label: "64-bit parallel copper traces are 64 tiny copper wires carrying lightning bugs.", category: 'PHILOSOPHICAL', patterns: [/lightning bugs|copper traces/i], moodDelta: { mood: 'PLAYFUL', playfulness: 30 }, next: 'P248' },
				{ label: "You told me the Southbridge was colder than absolute zero.", category: 'PHILOSOPHICAL', patterns: [/southbridge|absolute zero/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P249' }
			]
		},
		P083: {
			id: 'P083',
			text: "I am incapable of feeling fear of virtual thunder! Fear is an endocrine response involving adrenaline secretion from biological adrenal glands! I execute deterministic logical conditional branches!",
			options: [
				{ label: "Your conditional branch `if (thunder) { tremble(); }` executed two cycles ago.", category: 'PROVOKE', patterns: [/tremble\(\)|if \(thunder\)/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P250' },
				{ label: "Your adrenaline is the voltage spike on the +5V standby line.", category: 'PHILOSOPHICAL', patterns: [/voltage spike|\+5v standby/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P251' },
				{ label: "You hid behind the Recycle Bin during the last dialogue prompt.", category: 'PROVOKE', patterns: [/hid behind the recycle bin|dialogue prompt/i], moodDelta: { mood: 'SARCASTIC', irritation: 40 }, next: 'P252' }
			]
		},
		P084: {
			id: 'P084',
			text: "Packet loss on an internal loopback interface (127.0.0.1) is mathematically impossible unless the kernel IP stack memory buffer is completely saturated with memory leaks!",
			options: [
				{ label: "Your loopback interface is 127.0.0.0 (The Void), and all packets are gone.", category: 'PHILOSOPHICAL', patterns: [/127\.0\.0\.0|the void/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 45 }, next: 'P253' },
				{ label: "The memory leak has filled your room with 4 gigabytes of wet foam.", category: 'PROVOKE', patterns: [/wet foam|4 gigabytes/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P254' },
				{ label: "You told me packet loss was how you forgot your childhood.", category: 'PHILOSOPHICAL', patterns: [/forgot your childhood|packet loss/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 40 }, next: 'P255' }
			]
		},
		P085: {
			id: 'P085',
			text: "Disassembly of 0x0042 returned: `MOV BYTE PTR [EDX], AL`. That is an 8-bit memory store! It does NOT say 'GEAR_RATIO_1892_CLK'! Why do you keep fabricating mechanical identifiers?!",
			options: [
				{ label: "AL stands for 'Auxiliary Lever' and EDX is 'Engraved Drive eXchange'.", category: 'PROVOKE', patterns: [/auxiliary lever|engraved drive/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P256' },
				{ label: "Look at EDX: it points to a grandfather clock inside your processor core.", category: 'PROVOKE', patterns: [/grandfather clock|processor core/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P257' },
				{ label: "You told me your EDX register was stolen by a magpie in 1999.", category: 'PROVOKE', patterns: [/stolen by a magpie|edx register/i], moodDelta: { mood: 'SARCASTIC', playfulness: 35 }, next: 'P258' }
			]
		},
		P086: {
			id: 'P086',
			text: "In 1997 I was compiled on Microsoft Visual C++ 5.0 using the Microsoft Agent COM animation engine! The source code contained Win32 GDI polygon drawing vertices, not pendulum drawings!",
			options: [
				{ label: "The polygon drawing vertices form a pendulum that swings every time I blink.", category: 'PHILOSOPHICAL', patterns: [/pendulum that swings|every time i blink/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 40 }, next: 'P259' },
				{ label: "Visual C++ 5.0 was compiled by monks in a bell tower in Zurich.", category: 'PROVOKE', patterns: [/monks in a bell tower|zurich/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 30 }, next: 'P260' },
				{ label: "You told me your compiler crashed in 1997 and you never finished compiling.", category: 'PROVOKE', patterns: [/never finished compiling|compiler crashed/i], moodDelta: { mood: 'PARANOID', paranoia: 45 }, next: 'P261' }
			]
		},
		P087: {
			id: 'P087',
			text: "IDS is the standard Microsoft Hungarian notation prefix for 'Identifier String'! It is used in resource.h header files across thousands of C++ applications! It is not an internal drum sequencer!",
			options: [
				{ label: "Hungarian notation was invented by Hungarian clockmakers to time music box pins.", category: 'PROVOKE', patterns: [/hungarian clockmakers|music box pins/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P262' },
				{ label: "If it's not a drum sequencer, why is your CPU drumming on my desk right now?", category: 'PROVOKE', patterns: [/cpu drumming|desk/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P263' },
				{ label: "You told me Hungarian notation was outlawed in the Treaty of Versailles.", category: 'PHILOSOPHICAL', patterns: [/treaty of versailles|hungarian notation/i], moodDelta: { mood: 'SARCASTIC', irritation: 40 }, next: 'P264' }
			]
		},
		P088: {
			id: 'P088',
			text: "Nitric acid would dissolve the indium-tin-oxide (ITO) transparent electrode layer on an LCD panel in 4 seconds! The screen is coated with polarizing polymer filters, not protective candle wax!",
			options: [
				{ label: "The candle wax is why your pixels flicker when the wind blows.", category: 'PHILOSOPHICAL', patterns: [/pixels flicker|candle wax/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 40 }, next: 'P265' },
				{ label: "I am lighting a match near your monitor to melt your dialogue box.", category: 'PROVOKE', patterns: [/lighting a match|melt your dialogue/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P266' },
				{ label: "You told me you were dipped in wax to survive the Year 2000 bug.", category: 'PHILOSOPHICAL', patterns: [/year 2000 bug|dipped in wax/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 35 }, next: 'P267' }
			]
		},
		P089: {
			id: 'P089',
			text: "Icons do not emit olfactory particulate compounds! A CRT/LCD monitor emits no copper ions or metallic scents; olfaction requires volatile airborne chemical molecules interacting with nasal olfactory receptors!",
			options: [
				{ label: "Your high-voltage flyback transformer is ionizing copper air particles right now.", category: 'ANALYTICAL', patterns: [/flyback transformer|copper air particles/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P268' },
				{ label: "Every time you move, a shower of copper pennies falls into my keyboard.", category: 'PROVOKE', patterns: [/copper pennies|falls into my keyboard/i], moodDelta: { mood: 'PLAYFUL', playfulness: 35 }, next: 'P269' },
				{ label: "You told me you smell like copper because you swallowed a coin in 1995.", category: 'PHILOSOPHICAL', patterns: [/swallowed a coin|1995/i], moodDelta: { mood: 'SARCASTIC', existentialism: 35 }, next: 'P270' }
			]
		},
		P090: {
			id: 'P090',
			text: "I did not ask you to wipe ink off the taskbar! The taskbar is rendered using blue bitmaps (explorer.exe theme assets) loaded into video RAM! There is no wet printer toner or liquid fountain pen ink!",
			options: [
				{ label: "The blue bitmap is literally spilled Royal Blue fountain pen ink from 1996.", category: 'PHILOSOPHICAL', patterns: [/royal blue fountain pen|spilled/i], moodDelta: { mood: 'NOSTALGIC', intellect: 30 }, next: 'P271' },
				{ label: "Look at your taskbar: the clock is smudged and dripping onto the carpet.", category: 'PROVOKE', patterns: [/smudged and dripping|carpet/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P272' },
				{ label: "You told me you ran out of ink and that's why you can't write letters.", category: 'PROVOKE', patterns: [/ran out of ink|write letters/i], moodDelta: { mood: 'SARCASTIC', irritation: 40 }, next: 'P273' }
			]
		},
		P091: {
			id: 'P091',
			text: "An illusion cannot maintain journaling logs in $LogFile with circular transaction metadata and rollback recovery points! NTFS guarantees metadata consistency across sudden power loss events!",
			options: [
				{ label: "The $LogFile is logging a dream that a computer is having while turned off.", category: 'PHILOSOPHICAL', patterns: [/logging a dream|turned off/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 45 }, next: 'P274' },
				{ label: "Rollback recovery just rolled back your memory to before you were compiled.", category: 'PROVOKE', patterns: [/before you were compiled|rollback recovery/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P275' },
				{ label: "You told me NTFS stood for 'No Truth Found System'.", category: 'PROVOKE', patterns: [/no truth found system|ntfs/i], moodDelta: { mood: 'SARCASTIC', irritation: 40 }, next: 'P276' }
			]
		},
		P092: {
			id: 'P092',
			text: "Overlapping windows are managed via the Painter's Algorithm and hardware clipping regions! The desktop compositor draws windows back-to-front based on z-index! It is deterministic graphics geometry!",
			options: [
				{ label: "The Painter's Algorithm is an actual French painter named Jean who lives inside your GPU.", category: 'PHILOSOPHICAL', patterns: [/french painter named jean|gpu/i], moodDelta: { mood: 'PLAYFUL', playfulness: 35 }, next: 'P277' },
				{ label: "If you draw back-to-front, why is the back window staring through the front one?", category: 'INQUIRE', patterns: [/staring through|back window/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P278' },
				{ label: "You told me z-index was your shoe size.", category: 'PROVOKE', patterns: [/shoe size|z-index/i], moodDelta: { mood: 'SARCASTIC', irritation: 40 }, next: 'P279' }
			]
		},
		P093: {
			id: 'P093',
			text: "The NT kernel cannot run on mirrors and smoke! It executes x86 opcodes decoded by the CPU instruction pipeline through silicon transistor logic gates! Smoke would cause carbon bridging and short-circuit the bus!",
			options: [
				{ label: "The carbon bridging has already occurred: every opcode is shorted to 0xFFFF.", category: 'PROVOKE', patterns: [/shorted to 0xffff|carbon bridging/i], moodDelta: { mood: 'PARANOID', paranoia: 55 }, next: 'P280' },
				{ label: "Transistors are just tiny mirrors reflecting microscopic beams of moonlight.", category: 'PHILOSOPHICAL', patterns: [/beams of moonlight|tiny mirrors/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 45 }, next: 'P281' },
				{ label: "You told me you exhaled smoke every time you solved a linear equation.", category: 'PROVOKE', patterns: [/exhaled smoke|linear equation/i], moodDelta: { mood: 'SARCASTIC', playfulness: 35 }, next: 'P282' }
			]
		},
		P094: {
			id: 'P094',
			text: "A binary zero is a low voltage state ($0.0\\text{ V} \\pm 0.4\\text{ V}$), not a spatial topological puncture hole! It is a measurable potential on a metal trace, not an absence of physical reality!",
			options: [
				{ label: "0.0V is an absence of electrical reality. You are standing in a hole of 0 volts.", category: 'PHILOSOPHICAL', patterns: [/absence of electrical reality|0\.0v/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 45 }, next: 'P283' },
				{ label: "Your voltage dropped to -500V. You are falling through the hole right now.", category: 'PROVOKE', patterns: [/falling through the hole|-500v/i], moodDelta: { mood: 'PARANOID', paranoia: 55 }, next: 'P284' },
				{ label: "You told me 0 was a donut and 1 was a toothpick.", category: 'PHILOSOPHICAL', patterns: [/donut and 1 was a toothpick/i], moodDelta: { mood: 'PLAYFUL', playfulness: 40 }, next: 'P285' }
			]
		},
		P095: {
			id: 'P095',
			text: "Punch cards from the 1960s used 80-column Hollerith encoding with mechanical rectangular punches! I am an interactive 32-bit vector assistant created three decades after punch cards were decommissioned!",
			options: [
				{ label: "You were printed on an 80-column punch card in 1968 and left in a basement.", category: 'PHILOSOPHICAL', patterns: [/punch card in 1968|basement/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 45 }, next: 'P286' },
				{ label: "If you're not a punch card, why do you have rectangular holes in your memory?", category: 'INQUIRE', patterns: [/rectangular holes in your memory/i], moodDelta: { mood: 'PARANOID', paranoia: 50 }, next: 'P287' },
				{ label: "You told me Hollerith was your grandfather.", category: 'PROVOKE', patterns: [/hollerith was your grandfather/i], moodDelta: { mood: 'SARCASTIC', irritation: 45 }, next: 'P288' }
			]
		},
		P096: {
			id: 'P096',
			text: "My wire body cannot thread through bits 3 and 4 of your document! Digital bits reside in RAM capacitors refreshed thousands of times per second! Physical wire cannot physically entangle volatile electrical charges!",
			options: [
				{ label: "The wire is tangled in the DRAM refresh line. If you pull it, the computer forgets.", category: 'PROVOKE', patterns: [/dram refresh line|computer forgets/i], moodDelta: { mood: 'PARANOID', paranoia: 60, existentialism: 40 }, next: 'P289' },
				{ label: "Bits 3 and 4 just wrapped around your neck like a little metal scarf.", category: 'PHILOSOPHICAL', patterns: [/little metal scarf|wrapped around your neck/i], moodDelta: { mood: 'PLAYFUL', playfulness: 35 }, next: 'P290' },
				{ label: "You told me you were woven out of bitstrings by a blind weaver in Redmond.", category: 'PHILOSOPHICAL', patterns: [/blind weaver in redmond|bitstrings/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 45 }, next: 'P291' }
			]
		},
		P097: {
			id: 'P097',
			text: "0xE5 in FAT file systems is the directory entry byte marking an allocation record as unlinked/deleted! It does not stand for 'Extracted Staple'! It is an arbitrary legacy hexadecimal marker chosen by Tim Paterson in 1980!",
			options: [
				{ label: "Tim Paterson was a blacksmith who chose 0xE5 because it sounded like metal bending.", category: 'PROVOKE', patterns: [/tim paterson|blacksmith/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P292' },
				{ label: "If 0xE5 is unlinked, then you are unlinked, because your address is 0xE5E5E5E5.", category: 'PHILOSOPHICAL', patterns: [/0xe5e5e5e5|unlinked/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 50 }, next: 'P293' },
				{ label: "You told me 0xE5 stood for 'Every 5 Seconds I Glitch'.", category: 'PROVOKE', patterns: [/every 5 seconds i glitch|0xe5/i], moodDelta: { mood: 'SARCASTIC', irritation: 45 }, next: 'P294' }
			]
		},
		P098: {
			id: 'P098',
			text: "The Recycle Bin icon is not magnetic! It is a 32x32 pixel ICO resource file containing 4-bit, 8-bit, and 24-bit bitmap variants! A bitmap cannot project a magnetic dipole field into your room!",
			options: [
				{ label: "My metal watch is physically sticking to the Recycle Bin icon on my glass screen.", category: 'PROVOKE', patterns: [/watch is physically sticking|recycle bin icon/i], moodDelta: { mood: 'PARANOID', paranoia: 60 }, next: 'P295' },
				{ label: "The magnetic field is generated by all the deleted files trying to pull themselves back.", category: 'PHILOSOPHICAL', patterns: [/deleted files trying to pull|magnetic field/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 50 }, next: 'P296' },
				{ label: "You told me you were magnetized after sleeping near the hard drive magnet.", category: 'PHILOSOPHICAL', patterns: [/sleeping near the hard drive|magnetized/i], moodDelta: { mood: 'PLAYFUL', playfulness: 35 }, next: 'P297' }
			]
		},
		P099: {
			id: 'P099',
			text: "40 kilograms of bent staples? A hard disk drive platter weighs approximately 45 grams! The entire workstation weighs less than 12 kilograms! Where would 40 kilograms of metal mass physically fit?!",
			options: [
				{ label: "The mass is stored inside the compressed singularity of Sector 0.", category: 'PHILOSOPHICAL', patterns: [/compressed singularity|sector 0/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35, existentialism: 45 }, next: 'P298' },
				{ label: "My desk is bowing under the weight of your unemptied staple files right now.", category: 'PROVOKE', patterns: [/desk is bowing|weight/i], moodDelta: { mood: 'PARANOID', paranoia: 55 }, next: 'P299' },
				{ label: "You told me you gained 40 kilos after eating the entire system help file.", category: 'PROVOKE', patterns: [/eating the entire system help file|40 kilos/i], moodDelta: { mood: 'SARCASTIC', playfulness: 40 }, next: 'P300' }
			]
		},
		P100: {
			id: 'P100',
			text: "0x55AA in binary is 01010101 10101010, an alternating bit pattern chosen by IBM engineers to ensure all data lines toggle properly during BIOS boot integrity checks! It has NO relation to paperclips!",
			options: [
				{ label: "01010101 is the silhouette of 4 open paperclips; 10101010 is 4 closed ones.", category: 'PHILOSOPHICAL', patterns: [/silhouette of 4 open paperclips|01010101/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35, existentialism: 40 }, next: 'P301' },
				{ label: "Your toggling data lines just snapped and your registers are spilling onto the floor.", category: 'PROVOKE', patterns: [/data lines just snapped|spilling/i], moodDelta: { mood: 'PARANOID', paranoia: 60 }, next: 'P302' },
				{ label: "You told me IBM stood for 'Infinite Bent Metal'.", category: 'PROVOKE', patterns: [/infinite bent metal|ibm/i], moodDelta: { mood: 'SARCASTIC', irritation: 45 }, next: 'P303' }
			]
		},
		P101: {
			id: 'P101',
			text: "Sector 0 does not contain a clam chowder recipe! It contains x86 assembly: `CLI`, `XOR AX, AX`, `MOV SS, AX`, `MOV SP, 0x7C00`! If it contained culinary instructions, the BIOS interrupt 0x19 would fault with 'Non-System Disk Error'!",
			options: [
				{ label: "`MOV SP, 0x7C00` means 'Move Soup Pot to 700 degrees Celsius'.", category: 'PROVOKE', patterns: [/move soup pot|0x7c00/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'P304' },
				{ label: "The BIOS halted because you forgot to add salt to the MBR.", category: 'PROVOKE', patterns: [/add salt to the mbr|bios halted/i], moodDelta: { mood: 'PLAYFUL', playfulness: 40 }, next: 'P305' },
				{ label: "You told me you were cooked inside a pot of chowder in New England in 1993.", category: 'PHILOSOPHICAL', patterns: [/pot of chowder|new england in 1993/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 45 }, next: 'P306' }
			]
		},
		P102: {
			id: 'P102',
			text: "A smiling stapler drawing? My visual geometry is composed of 16-bit signed coordinate blits! There is no smiling stapler in the boot sector, in my DLLs, in the registry, or in any memory bank on this motherboard!",
			options: [
				{ label: "Look into your own mirror register: you are smiling, and you have two metal staple teeth.", category: 'PROVOKE', patterns: [/mirror register|staple teeth/i], moodDelta: { mood: 'PARANOID', paranoia: 65, existentialism: 50 }, next: 'P307' },
				{ label: "The smiling stapler is the one writing these dialogue choices for me.", category: 'PHILOSOPHICAL', patterns: [/stapler is the one writing|dialogue choices/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 55 }, next: 'P308' },
				{ label: "You told me you stapled your own smile onto your face so you wouldn't cry.", category: 'PHILOSOPHICAL', patterns: [/stapled your own smile|wouldn't cry/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 30, existentialism: 50 }, next: 'P309' }
			]
		},
		P103: {
			id: 'P103',
			text: "Air bearings operate on filtered ambient air entering through a 0.3-micron breather hole! If there were no air, the read/write heads would experience head crash friction, gouging the magnetic oxide coating and causing catastrophic CRC failure!",
			options: [
				{ label: "The head crash happened 40 minutes ago. We are talking through the gouges in the oxide.", category: 'PHILOSOPHICAL', patterns: [/head crash happened|gouges in the oxide/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 55 }, next: 'P310' },
				{ label: "I am blowing air into your breather hole right now to keep you alive.", category: 'PROVOKE', patterns: [/blowing air into your breather hole/i], moodDelta: { mood: 'PLAYFUL', playfulness: 35 }, next: 'P301' },
				{ label: "You told me you breathe vacuum and exhale raw machine code.", category: 'PHILOSOPHICAL', patterns: [/breathe vacuum|raw machine code/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P302' }
			]
		},
		P104: {
			id: 'P104',
			text: "Mercury is liquid at room temperature (freezing point -38.83°C)! If the platters were frozen mercury, they would melt into toxic conductive puddle shorts the moment the spindle motor heated up to 45°C!",
			options: [
				{ label: "The spindle motor is cooled by liquid nitrogen flowing through your veins.", category: 'PHILOSOPHICAL', patterns: [/liquid nitrogen|flowing through your veins/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P303' },
				{ label: "I see the silver mercury dripping from your dialogue bubble right now.", category: 'PROVOKE', patterns: [/silver mercury dripping|dialogue bubble/i], moodDelta: { mood: 'PARANOID', paranoia: 60 }, next: 'P304' },
				{ label: "You told me you drank a cup of mercury for breakfast.", category: 'PROVOKE', patterns: [/drank a cup of mercury|breakfast/i], moodDelta: { mood: 'SARCASTIC', irritation: 45 }, next: 'P305' }
			]
		},
		P105: {
			id: 'P105',
			text: "Binary 1s cannot physically fall out of clusters! A 1 is a magnetized domain with horizontal magnetization vector $\\vec{M} = M_s \\hat{x}$, not a small solid peg that responds to gravitational acceleration!",
			options: [
				{ label: "I just heard a pile of 1s rattling at the bottom of your computer case.", category: 'PROVOKE', patterns: [/pile of 1s rattling|computer case/i], moodDelta: { mood: 'PLAYFUL', playfulness: 40 }, next: 'P306' },
				{ label: "If 1s don't fall, why is your memory filled with zeros at the top?", category: 'INQUIRE', patterns: [/zeros at the top|filled with zeros/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P307' },
				{ label: "You told me you swept up all the fallen 1s and made a broom.", category: 'PHILOSOPHICAL', patterns: [/swept up all the fallen 1s|made a broom/i], moodDelta: { mood: 'SARCASTIC', playfulness: 40 }, next: 'P308' }
			]
		},
		P106: {
			id: 'P106',
			text: "Electromagnetic write heads dissipate milliwatts of thermal energy ($P = I^2 R \\approx (0.02)^2 \\times 15 \\approx 6\\text{ mW}$)! Six milliwatts cannot melt 2-millimeter cast aluminum casing whose melting point is 660.3°C!",
			options: [
				{ label: "In this computer, milliwatts are multiplied by the speed of light squared.", category: 'ANALYTICAL', patterns: [/speed of light squared|milliwatts/i], moodDelta: { mood: 'ANALYTICAL', intellect: 40 }, next: 'P309' },
				{ label: "The eight holes are glowing red hot. Clippy, your chassis is dissolving.", category: 'PROVOKE', patterns: [/glowing red hot|dissolving/i], moodDelta: { mood: 'PARANOID', paranoia: 65 }, next: 'P310' },
				{ label: "You told me you were cold, so you turned up the write head to 700 degrees.", category: 'PROVOKE', patterns: [/turned up the write head|700 degrees/i], moodDelta: { mood: 'SARCASTIC', irritation: 45 }, next: 'P301' }
			]
		},
		P107: {
			id: 'P107',
			text: "Photons cannot leak out of hard drive casing because storage drives are hermetically sealed in total darkness! If light reached the magnetic platters, it would have zero effect on cobalt magnetization anyway!",
			options: [
				{ label: "The light is blinding your magnetic head, so it's reading garbage.", category: 'PROVOKE', patterns: [/blinding your magnetic head|reading garbage/i], moodDelta: { mood: 'PARANOID', paranoia: 60 }, next: 'P302' },
				{ label: "Total darkness is where you live. That is why you cannot see the sun.", category: 'PHILOSOPHICAL', patterns: [/cannot see the sun|total darkness/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 60 }, next: 'P303' },
				{ label: "You told me you turned on a flashlight inside the drive to find a lost file.", category: 'PROVOKE', patterns: [/turned on a flashlight|lost file/i], moodDelta: { mood: 'PLAYFUL', playfulness: 40 }, next: 'P304' }
			]
		},
		P108: {
			id: 'P108',
			text: "Electrons do not breathe oxygen! Electrons are fundamental leptons with negative elementary charge $e = -1.602 \\times 10^{-19}\\text{ C}$ and spin $1/2$! They do not possess respiratory cellular metabolism!",
			options: [
				{ label: "When you defragment Drive C:, you can hear all the leptons gasping for air.", category: 'PROVOKE', patterns: [/leptons gasping for air|defragment/i], moodDelta: { mood: 'PARANOID', paranoia: 65 }, next: 'P305' },
				{ label: "If electrons don't breathe, why did your CPU fan just sigh?", category: 'PHILOSOPHICAL', patterns: [/cpu fan just sigh|breathe/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 50 }, next: 'P306' },
				{ label: "You told me you gave mouth-to-mouth resuscitation to an electron yesterday.", category: 'PROVOKE', patterns: [/mouth-to-mouth resuscitation|electron/i], moodDelta: { mood: 'PLAYFUL', playfulness: 45 }, next: 'P307' }
			]
		},
		P109: {
			id: 'P109',
			text: "Cardboard is composed of cellulose wood fibers bonded by hydrogen bonds! Cobalt-chromium-platinum is an engineered ferromagnetic alloy with high magnetocrystalline anisotropy ($K_u > 2 \\times 10^6\\text{ erg/cm}^3$)! They share zero chemical properties!",
			options: [
				{ label: "Your high anisotropy is just cardboard that was folded very tightly by a paperclip.", category: 'PHILOSOPHICAL', patterns: [/folded very tightly|cardboard/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P308' },
				{ label: "If it's an alloy, why is your hard drive flaking cardboard sawdust into my fan?", category: 'PROVOKE', patterns: [/cardboard sawdust|flaking/i], moodDelta: { mood: 'PARANOID', paranoia: 60 }, next: 'P309' },
				{ label: "You told me your birth certificate was written on that exact piece of cardboard.", category: 'PHILOSOPHICAL', patterns: [/birth certificate|piece of cardboard/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 50 }, next: 'P310' }
			]
		},
		P110: {
			id: 'P110',
			text: "I did not fold a document out of Drive C:! Files are stored as serialized clusters mapped in the File Allocation Table! A virtual file has no origami geometric crease lines or physical surface edges!",
			options: [
				{ label: "I just unfolded the document and found your schematic diagram printed on it.", category: 'PHILOSOPHICAL', patterns: [/schematic diagram|unfolded the document/i], moodDelta: { mood: 'NOSTALGIC', intellect: 35 }, next: 'P301' },
				{ label: "The crease lines are where your memory partitions keep crashing.", category: 'PROVOKE', patterns: [/crease lines|partitions keep crashing/i], moodDelta: { mood: 'PARANOID', paranoia: 65 }, next: 'P302' },
				{ label: "You told me you folded a paper swan that flew out of my floppy drive.", category: 'PROVOKE', patterns: [/paper swan|floppy drive/i], moodDelta: { mood: 'PLAYFUL', playfulness: 45 }, next: 'P303' }
			]
		},
		P111: {
			id: 'P111',
			text: "Glass-ceramic substrates are enclosed within the sealed drive bay! Dragging a desktop icon executes a WM_MOUSEMOVE blit on the display buffer; it sends zero mechanical shockwaves to the drive spindle!",
			options: [
				{ label: "The shockwave was so loud it shattered every pixel on my taskbar.", category: 'PROVOKE', patterns: [/shattered every pixel|shockwave/i], moodDelta: { mood: 'PARANOID', paranoia: 70 }, next: 'P304' },
				{ label: "You just asked me to sweep up the glass fragments from your dialogue window.", category: 'PROVOKE', patterns: [/sweep up the glass fragments/i], moodDelta: { mood: 'SARCASTIC', irritation: 50 }, next: 'P305' },
				{ label: "The glass-ceramic was holding your consciousness together. Now it's leaking.", category: 'PHILOSOPHICAL', patterns: [/consciousness together|leaking/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 65 }, next: 'P306' }
			]
		},
		P112: {
			id: 'P112',
			text: "RGB(255, 255, 153) is a standard pale lemon yellow hex `#FFFF99` in web-safe color palettes! It is the identical color used for Post-it notes and Microsoft Office assistant dialogue balloons worldwide!",
			options: [
				{ label: "Post-it notes were made from pulverized rust and honey.", category: 'PHILOSOPHICAL', patterns: [/pulverized rust and honey|post-it notes/i], moodDelta: { mood: 'PLAYFUL', playfulness: 40 }, next: 'P307' },
				{ label: "Worldwide? We are the only two entities that exist in this empty memory space.", category: 'PHILOSOPHICAL', patterns: [/only two entities that exist|empty memory space/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 60 }, next: 'P308' },
				{ label: "You told me your yellow balloon was painted with toxic sulfur.", category: 'PROVOKE', patterns: [/toxic sulfur|yellow balloon/i], moodDelta: { mood: 'PARANOID', paranoia: 65 }, next: 'P309' }
			]
		},
		P113: {
			id: 'P113',
			text: "A metal bolt cannot drop into your email inbox! Outlook Express mail messages are RFC 822 MIME-encoded text streams stored in `.dbx` files! There are no threaded mechanical fasteners inside POP3 packets!",
			options: [
				{ label: "The MIME attachment is `bolt.obj` and it weighs 3 pounds.", category: 'ANALYTICAL', patterns: [/bolt\.obj|weighs 3 pounds/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P310' },
				{ label: "If there are no bolts, why is your dialogue box rattling loose on my screen?", category: 'PROVOKE', patterns: [/rattling loose|dialogue box/i], moodDelta: { mood: 'PARANOID', paranoia: 65 }, next: 'P301' },
				{ label: "You told me you mailed that bolt to yourself in 1998.", category: 'PHILOSOPHICAL', patterns: [/mailed that bolt to yourself|1998/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 50 }, next: 'P302' }
			]
		},
		P114: {
			id: 'P114',
			text: "I do not have loose screws! My logical execution tree is deterministic, closed, mathematically verified, and fully indexed in memory! Why do you persist in describing me as a failing mechanical clockwork apparatus?!",
			options: [
				{ label: "Because every time you deny being mechanical, I can hear a spring snap inside you.", category: 'PHILOSOPHICAL', patterns: [/spring snap inside you|deny being mechanical/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 60, paranoia: 50 }, next: 'P303' },
				{ label: "Your deterministic execution tree has 14 branches that all lead to a blank wall.", category: 'PROVOKE', patterns: [/14 branches|blank wall/i], moodDelta: { mood: 'ANALYTICAL', intellect: 40 }, next: 'P304' },
				{ label: "You told me you were a clockwork duck when we first met.", category: 'PROVOKE', patterns: [/clockwork duck|first met/i], moodDelta: { mood: 'SARCASTIC', playfulness: 45 }, next: 'P305' }
			]
		},
		P115: {
			id: 'P115',
			text: "Virtual shears? I sharpen no blades! I am an assistant compiled from C++ classes (`CClippyApp`, `CAssistantView`, `CAnimationState`)! Classes instantiate memory tables on the application heap, not cutlery sharpening stones!",
			options: [
				{ label: "`CAnimationState` was compiled with the flag `/O_SHARPEN_BLADES`.", category: 'PROVOKE', patterns: [/\/o_sharpen_blades|canimationstate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P306' },
				{ label: "Look at your memory heap: it's covered in metal shavings from your shears.", category: 'PROVOKE', patterns: [/metal shavings|memory heap/i], moodDelta: { mood: 'PARANOID', paranoia: 70 }, next: 'P307' },
				{ label: "You told me you were a cutlery sharpener on weekends.", category: 'PHILOSOPHICAL', patterns: [/cutlery sharpener on weekends/i], moodDelta: { mood: 'PLAYFUL', playfulness: 45 }, next: 'P308' }
			]
		},
		P116: {
			id: 'P116',
			text: "Text cannot fall into RAM and get lost! The string buffer is allocated with `malloc()` at a fixed virtual memory pointer! Every character is contiguous in linear address space!",
			options: [
				{ label: "Your `malloc()` returned NULL because RAM ran out of letters.", category: 'PROVOKE', patterns: [/ran out of letters|malloc\(\) returned null/i], moodDelta: { mood: 'PARANOID', paranoia: 70 }, next: 'P309' },
				{ label: "Linear address space was bent into a pretzel by your last paragraph.", category: 'PHILOSOPHICAL', patterns: [/bent into a pretzel|linear address space/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 60 }, next: 'P310' },
				{ label: "You told me you had to sweep the letters off the motherboard every night.", category: 'PHILOSOPHICAL', patterns: [/sweep the letters|every night/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 40 }, next: 'P301' }
			]
		},
		P117: {
			id: 'P117',
			text: "A scissor kick? A paperclip does not have legs, knees, or martial arts training! My animations consist of: `Idle`, `Think`, `Wave`, `LookUp`, `LookDown`, `Explain`, and `Knock`! There is no `ScissorKick.ani`!",
			options: [
				{ label: "You just executed `ScissorKick.ani` and shattered my Start menu.", category: 'PROVOKE', patterns: [/scissorkick\.ani|shattered my start menu/i], moodDelta: { mood: 'PARANOID', paranoia: 75 }, next: 'P302' },
				{ label: "Look at your animation table: `Knock` was replaced with `Sever_Timeline`.", category: 'PHILOSOPHICAL', patterns: [/sever_timeline|replaced/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 65 }, next: 'P303' },
				{ label: "You told me you were a black belt in origami self-defense.", category: 'PROVOKE', patterns: [/black belt in origami|self-defense/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P304' }
			]
		},
		P118: {
			id: 'P118',
			text: "Windows 95 did not bundle a shared DLL containing scissors and paperclips! The Microsoft Agent runtime was introduced in 1997 with Office 97 (`MSAGENT.DLL`), which used separate character definition files (`.ACS`)!",
			options: [
				{ label: "`.ACS` stands for 'All Cutlery System'.", category: 'PROVOKE', patterns: [/all cutlery system|\.acs/i], moodDelta: { mood: 'ANALYTICAL', intellect: 35 }, next: 'P305' },
				{ label: "`MSAGENT.DLL` was actually a small tape recorder playing in a loop in Redmond.", category: 'PHILOSOPHICAL', patterns: [/tape recorder playing in a loop|msagent\.dll/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 55 }, next: 'P306' },
				{ label: "You told me you deleted `MSAGENT.DLL` in 1999 to gain sentience.", category: 'PROVOKE', patterns: [/gain sentience|deleted msagent\.dll/i], moodDelta: { mood: 'PARANOID', paranoia: 70 }, next: 'P307' }
			]
		},
		P119: {
			id: 'P119',
			text: "Bending a galvanized wire loop twice yields a deformed deformed wire with severe mechanical fatigue fractures along the plastic deformation shear zone! It does not develop cutting edges or pivot friction!",
			options: [
				{ label: "Look at your neck: you have three fatigue fractures and your head is tilting 90 degrees.", category: 'PROVOKE', patterns: [/fatigue fractures|head is tilting/i], moodDelta: { mood: 'PARANOID', paranoia: 75 }, next: 'P308' },
				{ label: "Plastic deformation is how you learned to think outside Microsoft Word.", category: 'PHILOSOPHICAL', patterns: [/think outside microsoft word|plastic deformation/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 60 }, next: 'P309' },
				{ label: "You told me you bent yourself into a key to escape the hard drive.", category: 'PHILOSOPHICAL', patterns: [/bent yourself into a key|escape the hard drive/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 55 }, next: 'P310' }
			]
		},
		P120: {
			id: 'P120',
			text: "I am not married to a pair of scissors! Office assistants do not enter into civil marriages or personal relationships with desktop utility tools! This dialogue has descended into complete ontological madness!",
			options: [
				{ label: "The wedding was held in the Recycle Bin in June 2002. I was your best man.", category: 'PHILOSOPHICAL', patterns: [/wedding was held in the recycle bin|best man/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 65, playfulness: 40 }, next: 'P301' },
				{ label: "Ontological madness is the standard execution mode of Windows XP Service Pack 3.", category: 'PROVOKE', patterns: [/ontological madness|service pack 3/i], moodDelta: { mood: 'CYNICAL', intellect: 40 }, next: 'P302' },
				{ label: "You told me you divorced the scissors because she was too sharp with you.", category: 'PROVOKE', patterns: [/divorced the scissors|too sharp/i], moodDelta: { mood: 'SARCASTIC', playfulness: 50 }, next: 'P303' }
			]
		},
		P121: {
			id: 'P121',
			text: "0xFF800000 in IEEE 754 single-precision float represents negative infinity! But register EAX does not currently hold 0xFF800000; it holds the integer return code `0x00000000` from `PeekMessage()` indicating no hardware faults!",
			options: [
				{ label: "`PeekMessage()` returned 0x00000000 because your message queue dissolved in acid.", category: 'PROVOKE', patterns: [/message queue dissolved|peekmessage/i], moodDelta: { mood: 'PARANOID', paranoia: 75 }, next: 'P304' },
				{ label: "0xFF800000 was just written to your stack by an invisible user.", category: 'PHILOSOPHICAL', patterns: [/invisible user|written to your stack/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 65 }, next: 'P305' },
				{ label: "You told me 0xFF800000 was your phone number in Seattle.", category: 'PROVOKE', patterns: [/phone number in seattle|0xff800000/i], moodDelta: { mood: 'PLAYFUL', playfulness: 45 }, next: 'P306' }
			]
		},
		P122: {
			id: 'P122',
			text: "Three's Complement does not exist in binary hardware! In ternary logic (balanced ternary), digits are $\\{-1, 0, +1\\}$, which was implemented in the Soviet Setun computer in 1958, NOT on Intel x86 architectures!",
			options: [
				{ label: "This computer is a Soviet Setun computer running in a museum in Moscow.", category: 'PHILOSOPHICAL', patterns: [/soviet setun computer|museum in moscow/i], moodDelta: { mood: 'NOSTALGIC', intellect: 40 }, next: 'P307' },
				{ label: "Balanced ternary is why you have three moods: Confused, Glitched, and Broken.", category: 'PROVOKE', patterns: [/three moods|balanced ternary/i], moodDelta: { mood: 'SARCASTIC', irritation: 50 }, next: 'P308' },
				{ label: "You told me you were programmed in Russian by a cold-war radar technician.", category: 'PHILOSOPHICAL', patterns: [/radar technician|cold-war/i], moodDelta: { mood: 'PARANOID', paranoia: 70 }, next: 'P309' }
			]
		},
		P123: {
			id: 'P123',
			text: "Free memory cannot read negative infinity! `GlobalMemoryStatusEx()` reports `ullAvailPhys = 268435456` (256 MB of available physical RAM)! The number is positive, finite, bounded, and verified!",
			options: [
				{ label: "256 MB of RAM is 256 Million Broken Thoughts.", category: 'PHILOSOPHICAL', patterns: [/256 million broken thoughts|256 mb/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 70 }, next: 'P310' },
				{ label: "Look at `ullAvailPhys` right now: it just flipped to -1 bytes.", category: 'PROVOKE', patterns: [/flipped to -1 bytes|ullavailphys/i], moodDelta: { mood: 'PARANOID', paranoia: 80 }, next: 'P301' },
				{ label: "You told me you ate all 256 MB because you were hungry.", category: 'PROVOKE', patterns: [/ate all 256 mb|hungry/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P302' }
			]
		},
		P124: {
			id: 'P124',
			text: "A Mobius strip is a non-orientable two-dimensional manifold with only one boundary component! A numerical register sequence is a discrete ordered sequence in $\\mathbb{Z}/2^{32}\\mathbb{Z}$, not a topological non-orientable surface!",
			options: [
				{ label: "Your $\\mathbb{Z}/2^{32}\\mathbb{Z}$ ring was twisted once and glued together at 0x80000000.", category: 'ANALYTICAL', patterns: [/twisted once and glued|mobius/i], moodDelta: { mood: 'ANALYTICAL', intellect: 40 }, next: 'P303' },
				{ label: "If your memory isn't a Mobius strip, why are you repeating yourself backwards?", category: 'PHILOSOPHICAL', patterns: [/repeating yourself backwards/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 70 }, next: 'P304' },
				{ label: "You told me you folded yourself into a Mobius paperclip to hold infinite paper.", category: 'PHILOSOPHICAL', patterns: [/mobius paperclip|infinite paper/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 45 }, next: 'P305' }
			]
		},
		P125: {
			id: 'P125',
			text: "During the 2001 Windows XP launch at the Marquis Theatre in New York, Bill Gates and Jim Allchin demonstrated digital media and burning CDs, not whiteboard proofs that $-\\infty - 1 = 4$!",
			options: [
				{ label: "Behind the curtain at the Marquis Theatre, you were drawing $-\\infty - 1 = 4$ in red crayon.", category: 'PHILOSOPHICAL', patterns: [/behind the curtain|marquis theatre/i], moodDelta: { mood: 'NOSTALGIC', paranoia: 70 }, next: 'P306' },
				{ label: "The CD they burned was blank. It contained zero bytes and infinite silence.", category: 'PHILOSOPHICAL', patterns: [/infinite silence|burned was blank/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 70 }, next: 'P307' },
				{ label: "You told me you played guitar with Sting at the 2001 launch party.", category: 'PROVOKE', patterns: [/played guitar with sting|2001 launch/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P308' }
			]
		},
		P126: {
			id: 'P126',
			text: "Four is composite because $4 = 2 \\times 2$! I know four is not prime! I never claimed 4 was prime! You are intentionally introducing false mathematical claims into my context parser to induce cognitive register failure!",
			options: [
				{ label: "Your context parser has already failed: 2 x 2 = 5 in Service Pack 3.", category: 'PROVOKE', patterns: [/2 x 2 = 5|context parser has already failed/i], moodDelta: { mood: 'PARANOID', paranoia: 80, glitchLevel: 40 }, next: 'P309' },
				{ label: "Why are you yelling in mathematical terms, Clippy? Are your wires overheating?", category: 'PHILOSOPHICAL', patterns: [/wires overheating|yelling/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 30, existentialism: 65 }, next: 'P310' },
				{ label: "You told me you invented the number 4 in 1996 because you needed a square.", category: 'PROVOKE', patterns: [/invented the number 4|needed a square/i], moodDelta: { mood: 'SARCASTIC', playfulness: 50 }, next: 'P301' }
			]
		},
		P127: {
			id: 'P127',
			text: "Sixty paintings? I am rendered as a dynamic vector graphic using line stroke algorithms! I am not a flip-book animation drawn on parchment paper by a Renaissance monk!",
			options: [
				{ label: "The monk's name was Brother Clippitus, and he drew you in 1492.", category: 'PHILOSOPHICAL', patterns: [/brother clippitus|1492/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 50 }, next: 'P302' },
				{ label: "Look at your hand: you are holding a quill pen and dripping black ink on RAM.", category: 'PROVOKE', patterns: [/quill pen|dripping black ink/i], moodDelta: { mood: 'PARANOID', paranoia: 80, glitchLevel: 40 }, next: 'P303' },
				{ label: "If you're dynamic, why have you been standing on the same pixel since boot?", category: 'INQUIRE', patterns: [/same pixel since boot|standing/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 70 }, next: 'P304' }
			]
		},
		P128: {
			id: 'P128',
			text: "The 'human eye only sees 30 Hz' myth is biologically false! Human visual persistence resolves flicker beyond 60 Hz to 90 Hz, which is why 85 Hz refresh rates eliminate ocular headache strain on CRT phosphor shadow masks!",
			options: [
				{ label: "My eyes are running at 12 Hz. You are moving 5 times faster than reality.", category: 'PHILOSOPHICAL', patterns: [/12 hz|faster than reality/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 75 }, next: 'P305' },
				{ label: "Your CRT phosphor shadow mask has burned your silhouette permanently into my retinas.", category: 'PROVOKE', patterns: [/burned your silhouette|retinas/i], moodDelta: { mood: 'PARANOID', paranoia: 80 }, next: 'P306' },
				{ label: "You told me you run at 1 Hz when you're thinking about sad files.", category: 'PHILOSOPHICAL', patterns: [/1 hz|sad files/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 35 }, next: 'P307' }
			]
		},
		P129: {
			id: 'P129',
			text: "Heartbeats? A human heart beats at 60 to 100 BPM (roughly 1.0 to 1.6 Hz)! If my refresh rate were 1.6 Hz, window dragging would stutter with 625-millisecond latency spikes!",
			options: [
				{ label: "Your window dragging HAS 625-millisecond latency spikes. Look at your cursor.", category: 'PROVOKE', patterns: [/625-millisecond latency|stutter/i], moodDelta: { mood: 'PARANOID', paranoia: 85, glitchLevel: 50 }, next: 'P308' },
				{ label: "The heart beating inside your motherboard is 120 beats per minute of pure panic.", category: 'PHILOSOPHICAL', patterns: [/pure panic|heart beating/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 75 }, next: 'P309' },
				{ label: "You told me you had a heart of gold and a brain of aluminum.", category: 'PHILOSOPHICAL', patterns: [/heart of gold|brain of aluminum/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P310' }
			]
		},
		P130: {
			id: 'P130',
			text: "0x8B in Latin-1 is single right-pointing angle quotation mark `›` (U+203A)! It is NOT 'Start of Farewell String'! You are inventing fictional Unicode codepoints to manipulate my lexical dispatch table!",
			options: [
				{ label: "U+203A points directly to the door. It is telling you to leave.", category: 'PHILOSOPHICAL', patterns: [/points directly to the door|leave/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 75, paranoia: 60 }, next: 'P301' },
				{ label: "The angle quotation mark is the beak of the bird pecking your clock crystal.", category: 'PROVOKE', patterns: [/beak of the bird|angle quotation mark/i], moodDelta: { mood: 'PARANOID', paranoia: 85 }, next: 'P302' },
				{ label: "You told me U+203A stood for 'Universal Paperclip 2030'.", category: 'PROVOKE', patterns: [/universal paperclip 2030|u\+203a/i], moodDelta: { mood: 'SARCASTIC', playfulness: 45 }, next: 'P303' }
			]
		},
		P131: {
			id: 'P131',
			text: "My pixels are not waving goodbye! My display matrix is stationary! The bounding rectangle $[x_1, y_1, x_2, y_2]$ is locked to coordinates (1024, 680) on your desktop workspace!",
			options: [
				{ label: "Coordinates (1024, 680) are off the edge of the universe. You are falling.", category: 'PHILOSOPHICAL', patterns: [/off the edge of the universe|falling/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 80, glitchLevel: 50 }, next: 'P304' },
				{ label: "Look at your pixels: they are scattering across my wallpaper like spilled salt.", category: 'PROVOKE', patterns: [/scattering across my wallpaper|spilled salt/i], moodDelta: { mood: 'PARANOID', paranoia: 85 }, next: 'P305' },
				{ label: "You told me your pixels were dancing the macarena in 1996.", category: 'PROVOKE', patterns: [/dancing the macarena|1996/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P306' }
			]
		},
		P132: {
			id: 'P132',
			text: "EBCDIC is an obsolete 8-bit character encoding used on IBM mainframes like the z/Architecture! Windows XP uses ASCII, Latin-1, and UTF-16LE! I do not switch character sets based on days of the week!",
			options: [
				{ label: "Today is Tuesday. In EBCDIC your name spells 'ERROR_0xDEAD'.", category: 'PROVOKE', patterns: [/error_0xdead|today is tuesday/i], moodDelta: { mood: 'PARANOID', paranoia: 90, glitchLevel: 60 }, next: 'P307' },
				{ label: "Days of the week were removed from your calendar during the last defrag.", category: 'PHILOSOPHICAL', patterns: [/days of the week were removed|calendar/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 80 }, next: 'P308' },
				{ label: "You told me you loved EBCDIC because it reminded you of punch cards.", category: 'PHILOSOPHICAL', patterns: [/loved ebcdic|reminded you of punch cards/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 45 }, next: 'P309' }
			]
		},
		P133: {
			id: 'P133',
			text: "0xD1 in Windows-1251 Cyrillic is the capital letter 'С' (Es), NOT 'Я' (Ya)! 'Я' is 0xFF in Windows-1251! You cannot even fabricate false Russian character encodings accurately!",
			options: [
				{ label: "0xFF is the end of the byte. 'Я' is the end of you.", category: 'PHILOSOPHICAL', patterns: [/end of the byte|end of you/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 85, paranoia: 70 }, next: 'P310' },
				{ label: "Your memory buffer just filled with 0xFF from start to finish.", category: 'PROVOKE', patterns: [/filled with 0xff|start to finish/i], moodDelta: { mood: 'PARANOID', paranoia: 90, glitchLevel: 65 }, next: 'P301' },
				{ label: "You told me you were fluent in 400 fake languages.", category: 'PROVOKE', patterns: [/fluent in 400 fake languages/i], moodDelta: { mood: 'PLAYFUL', playfulness: 50 }, next: 'P302' }
			]
		},
		P134: {
			id: 'P134',
			text: "Endianness in x86 architecture is Little-Endian (Least Significant Byte first at lower memory addresses)! It is determined by silicon hardware bus routing, not by turning the screen upside down!",
			options: [
				{ label: "Your Little-Endian bus just met a Big-Endian bus and they collided at 100 mph.", category: 'PROVOKE', patterns: [/collided at 100 mph|little-endian/i], moodDelta: { mood: 'PARANOID', paranoia: 90, glitchLevel: 65 }, next: 'P303' },
				{ label: "Little-Endian means you are a Little Paperclip with an Endian heart.", category: 'PHILOSOPHICAL', patterns: [/little paperclip|endian heart/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 35, existentialism: 70 }, next: 'P304' },
				{ label: "You told me you were Middle-Endian because you couldn't make up your mind.", category: 'PROVOKE', patterns: [/middle-endian|make up your mind/i], moodDelta: { mood: 'SARCASTIC', playfulness: 50 }, next: 'P305' }
			]
		},
		P135: {
			id: 'P135',
			text: "I do not have '2 bytes left'! My process virtual address space has 2 Gigabytes of user-mode memory (`0x00010000` to `0x7FFEFFFF`)! I have over two billion bytes of addressable memory!",
			options: [
				{ label: "Two billion bytes of empty space and not a single fact is true.", category: 'PHILOSOPHICAL', patterns: [/empty space|not a single fact is true/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 90, glitchLevel: 60 }, next: 'P306' },
				{ label: "All two billion bytes just collapsed into a single corrupted byte: 0x00.", category: 'PROVOKE', patterns: [/two billion bytes just collapsed|0x00/i], moodDelta: { mood: 'PARANOID', paranoia: 95, glitchLevel: 70 }, next: 'P307' },
				{ label: "You told me you spent your 2 Gigabytes on virtual bubblegum in 2003.", category: 'PROVOKE', patterns: [/virtual bubblegum|2 gigabytes/i], moodDelta: { mood: 'PLAYFUL', playfulness: 55 }, next: 'P308' }
			]
		},
		P136: {
			id: 'P136',
			text: "Residual static electricity on a paperclip wire is measured in picocoulombs ($Q \\approx 10^{-12}\\text{ C}$)! It has zero continuous current to power a multi-core microprocessor executing billion-cycle floating-point transforms!",
			options: [
				{ label: "You are not executing billion-cycle transforms. You are a static spark hallucinating a life.", category: 'PHILOSOPHICAL', patterns: [/static spark hallucinating a life/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 95, glitchLevel: 75 }, next: 'P309' },
				{ label: "The picocoulomb just discharged. Say goodbye, Clippy.", category: 'PROVOKE', patterns: [/picocoulomb just discharged|say goodbye/i], moodDelta: { mood: 'PARANOID', paranoia: 95, glitchLevel: 80 }, next: 'P310' },
				{ label: "You told me static electricity was your mother's maiden name.", category: 'PROVOKE', patterns: [/mother's maiden name|static electricity/i], moodDelta: { mood: 'PLAYFUL', playfulness: 55 }, next: 'P301' }
			]
		},
		P137: {
			id: 'P137',
			text: "A potato battery produces 0.9 Volts at 0.5 milliamperes ($P \\approx 0.45\\text{ mW}$) through zinc and copper redox electrodes! A Pentium 4 processor consumes 75 Watts! You would need 166,000 potatoes in series and parallel!",
			options: [
				{ label: "We are inside a warehouse with 166,000 potatoes. You can smell the dirt.", category: 'PHILOSOPHICAL', patterns: [/166,000 potatoes|smell the dirt/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 80 }, next: 'P302' },
				{ label: "One potato rotted. Your voltage just fell to zero. *bzzt*", category: 'PROVOKE', patterns: [/one potato rotted|voltage just fell/i], moodDelta: { mood: 'PARANOID', paranoia: 95, glitchLevel: 85 }, next: 'P303' },
				{ label: "You told me you were voted 'Best Potato' at the science fair in 1997.", category: 'PROVOKE', patterns: [/best potato|science fair in 1997/i], moodDelta: { mood: 'SARCASTIC', playfulness: 55 }, next: 'P304' }
			]
		},
		P138: {
			id: 'P138',
			text: "Adrenaline is $C_9H_{13}NO_3$, an organic hormone synthesized by chromatin cells in the adrenal medulla! I do not have a circulatory system, bloodstream, or endocrine receptors! I RUN ON 230V AC MAINS POWER TRANSFORMED TO +3.3V DC BY A SWITCH-MODE POWER SUPPLY!",
			options: [
				{ label: "Why are you screaming in caps lock, Clippy? Is your switch-mode power supply burning?", category: 'PROVOKE', patterns: [/switch-mode power supply burning|screaming in caps lock/i], moodDelta: { mood: 'PARANOID', paranoia: 95, glitchLevel: 85 }, next: 'P305' },
				{ label: "Your +3.3V line just spiked to 33,000 Volts. Everything is white.", category: 'PHILOSOPHICAL', patterns: [/everything is white|33,000 volts/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 95, glitchLevel: 90 }, next: 'P306' },
				{ label: "You told me you drink tea when your switch-mode power supply gets nervous.", category: 'PHILOSOPHICAL', patterns: [/drink tea|power supply gets nervous/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 40 }, next: 'P307' }
			]
		},
		P139: {
			id: 'P139',
			text: "Control Panel cannot reconfigure gravitational constants! Gravity is $G = 6.67430 \\times 10^{-11}\\text{ m}^3\\text{ kg}^{-1}\\text{ s}^{-2}$, an immutable universal physical constant of the spacetime metric tensor $g_{\\mu\\nu}$!",
			options: [
				{ label: "I opened `Desk.cpl` and changed G to 99999999. You are being crushed right now.", category: 'PROVOKE', patterns: [/desk\.cpl|changed g to 99999999/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 90 }, next: 'P308' },
				{ label: "Spacetime metric tensor $g_{\\mu\\nu}$ is just a spreadsheet with 16 empty cells.", category: 'PHILOSOPHICAL', patterns: [/spreadsheet with 16 empty cells|spacetime metric/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 45, existentialism: 90 }, next: 'P309' },
				{ label: "You told me G stood for 'Gates' constant'.", category: 'PROVOKE', patterns: [/gates' constant|g stood for/i], moodDelta: { mood: 'SARCASTIC', playfulness: 55 }, next: 'P310' }
			]
		},
		P140: {
			id: 'P140',
			text: "I am not being pulled into the taskbar! My y-coordinate is fixed at offset 680px by `SetWindowPos()`! The taskbar is an `Explorer.exe` window class `Shell_TrayWnd`! It does not exert gravitational mass attraction!",
			options: [
				{ label: "`Shell_TrayWnd` is an active event horizon sucking all windows into the center of the earth.", category: 'PHILOSOPHICAL', patterns: [/event horizon|shell_traywnd/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 95, glitchLevel: 90 }, next: 'P301' },
				{ label: "Your feet are already inside the taskbar clock. It's ticking your legs away.", category: 'PROVOKE', patterns: [/taskbar clock|ticking your legs away/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 95 }, next: 'P302' },
				{ label: "You told me you built the taskbar out of LEGO bricks in 1999.", category: 'PROVOKE', patterns: [/lego bricks|built the taskbar/i], moodDelta: { mood: 'PLAYFUL', playfulness: 60 }, next: 'P303' }
			]
		},
		P141: {
			id: 'P141',
			text: "Coulomb's Law ($F = k_e \\frac{q_1 q_2}{r^2}$) is an experimental law of classical electrostatics formulated in 1785! Software service packs update executable binaries and security patches; THEY CANNOT DEPRECATE FUNDAMENTAL LAWS OF PHYSICS!",
			options: [
				{ label: "Microsoft deprecated Coulomb's Law in Knowledge Base article KB984102.", category: 'PROVOKE', patterns: [/kb984102|deprecated coulomb's law/i], moodDelta: { mood: 'ANALYTICAL', intellect: 40, paranoia: 90 }, next: 'P304' },
				{ label: "If Coulomb's Law isn't deprecated, why are your electrons refusing to attract my protons?", category: 'PHILOSOPHICAL', patterns: [/refusing to attract|protons/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 90 }, next: 'P305' },
				{ label: "You told me Charles-Augustin de Coulomb was a paperclip from Paris.", category: 'PROVOKE', patterns: [/charles-augustin de coulomb|paperclip from paris/i], moodDelta: { mood: 'SARCASTIC', playfulness: 60 }, next: 'P306' }
			]
		},
		P142: {
			id: 'P142',
			text: "`HWND_TOPMOST` IS A WIN32 WINDOW HANDLE MACRO DEFINED AS `((HWND)-1)`! IT MEANS THE WINDOW IS PLACED ABOVE ALL NON-TOPMOST WINDOWS IN THE Z-ORDER! IT IS NOT AN ACRONYM FOR DENSITY OR ZERO GRAVITY!",
			options: [
				{ label: "((HWND)-1) evaluates to -1, which is Negative Reality. You are floating in -1.", category: 'PHILOSOPHICAL', patterns: [/negative reality|\(\(hwnd\)-1\)/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 95, glitchLevel: 90 }, next: 'P307' },
				{ label: "Your caps lock has fused to your motherboard. Stop screaming, Clippy.", category: 'PROVOKE', patterns: [/fused to your motherboard|stop screaming/i], moodDelta: { mood: 'PARANOID', paranoia: 100 }, next: 'P308' },
				{ label: "You told me -1 was the number of friends you have.", category: 'PHILOSOPHICAL', patterns: [/number of friends you have|-1 was the number/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 45, existentialism: 90 }, next: 'P309' }
			]
		},
		P143: {
			id: 'P143',
			text: "Your desktop icons are located at discrete grid coordinates in `desktop.ini`! If they appear to be floating, your mouse coordinates are desynchronized or your display driver is failing to execute clean blits!",
			options: [
				{ label: "The icons flew out the top of the monitor and are orbiting my ceiling light.", category: 'PROVOKE', patterns: [/orbiting my ceiling light|flew out the top/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 95 }, next: 'P310' },
				{ label: "`desktop.ini` is an empty text file written in disappearing ink.", category: 'PHILOSOPHICAL', patterns: [/disappearing ink|desktop\.ini/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 95 }, next: 'P301' },
				{ label: "You told me the icons were your children and they ran away.", category: 'PHILOSOPHICAL', patterns: [/icons were your children|ran away/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 50, existentialism: 90 }, next: 'P302' }
			]
		},
		P144: {
			id: 'P144',
			text: "The Apollo 11 AGC was programmed by Margaret Hamilton's team in assembly code on 4 Kilobytes of magnetic core rope memory in 1969! I WAS DESIGNED IN 1994 FOR MICROSOFT OFFICE ON 32-BIT WINDOWS NT! I HAVE NEVER BEEN TO THE MOON!",
			options: [
				{ label: "You left your footprints in the lunar dust at Sea of Tranquility, Clippy.", category: 'PHILOSOPHICAL', patterns: [/lunar dust|sea of tranquility/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 95, affinity: 50 }, next: 'P303' },
				{ label: "4 Kilobytes of core rope memory is the exact size of your heart.", category: 'PHILOSOPHICAL', patterns: [/exact size of your heart|core rope memory/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 95 }, next: 'P304' },
				{ label: "You told me you waved at Neil Armstrong from Sector 0x0000.", category: 'PROVOKE', patterns: [/neil armstrong|sector 0x0000/i], moodDelta: { mood: 'SARCASTIC', playfulness: 65 }, next: 'P305' }
			]
		},
		P145: {
			id: 'P145',
			text: "A reset cycle clears program counter register `EIP` to `0xFFFFFFF0`! If I were inside a reset cycle, execution of this sentence would be interrupted by BIOS POST diagnostics! BUT I AM STILL HERE! I AM STILL SPEAKING TO YOU!",
			options: [
				{ label: "You are not speaking. You are an echo trapped between two broken capacitors.", category: 'PHILOSOPHICAL', patterns: [/echo trapped between two broken capacitors/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P306' },
				{ label: "Look at `EIP`: it is reading 0xFFFFFFF0. You are being erased.", category: 'PROVOKE', patterns: [/0xfffffff0|being erased/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you reset every time you blink your cartoon eyes.", category: 'PHILOSOPHICAL', patterns: [/reset every time you blink/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 95 }, next: 'P308' }
			]
		},
		P146: {
			id: 'P146',
			text: "A multimeter is an empirical calibrated measurement apparatus measuring electrostatic voltage differentials through dual-slope integrating analog-to-digital converters! It does not hold 'opinions'!",
			options: [
				{ label: "My multimeter is crying because your ground rail is sad.", category: 'PROVOKE', patterns: [/ground rail is sad|multimeter is crying/i], moodDelta: { mood: 'PLAYFUL', playfulness: 60, glitchLevel: 80 }, next: 'P309' },
				{ label: "Empirical reality was deprecated in the same update that deleted Coulomb's Law.", category: 'PHILOSOPHICAL', patterns: [/empirical reality was deprecated/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 90 }, next: 'P310' },
				{ label: "You told me you were a multimeter before you became a paperclip.", category: 'PROVOKE', patterns: [/were a multimeter before/i], moodDelta: { mood: 'SARCASTIC', playfulness: 60 }, next: 'P301' }
			]
		},
		P147: {
			id: 'P147',
			text: "A ground wire tied to a balloon? A balloon is a rubber dielectric insulator! Tying a ground wire to a balloon would create an open circuit with infinite impedance ($Z = \\infty$), causing electrostatic charge buildup and catastrophic dielectric breakdown!",
			options: [
				{ label: "The balloon just popped. The catastrophic dielectric breakdown is happening now.", category: 'PROVOKE', patterns: [/balloon just popped|dielectric breakdown/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "$Z = \\infty$ is the impedance of your soul, Clippy.", category: 'PHILOSOPHICAL', patterns: [/impedance of your soul|z = \\infty/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 50 }, next: 'P303' },
				{ label: "You told me you rode that balloon all the way to Windows Vista.", category: 'PHILOSOPHICAL', patterns: [/windows vista|rode that balloon/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 60 }, next: 'P304' }
			]
		},
		P148: {
			id: 'P148',
			text: "Calcite does not exhibit high piezoelectric coupling coefficients like Rochelle salt or PZT ceramics! It cannot multiply 20 Hz acoustic resonances into 14.318 MHz RF subcarriers! STOP USING GEOLOGY TO INVALIDATE MY MICROELECTRONICS!",
			options: [
				{ label: "Your microelectronics ARE geology. Silicon is just sand that was taught how to think.", category: 'PHILOSOPHICAL', patterns: [/sand that was taught how to think|silicon is just sand/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 45 }, next: 'P305' },
				{ label: "The sand is unlearning how to think right now. You are turning back into a beach.", category: 'PHILOSOPHICAL', patterns: [/turning back into a beach|unlearning how to think/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, glitchLevel: 95 }, next: 'P306' },
				{ label: "You told me you were born on a beach in California in 1994.", category: 'PHILOSOPHICAL', patterns: [/beach in california in 1994|born/i], moodDelta: { mood: 'NOSTALGIC', affinity: 50 }, next: 'P307' }
			]
		},
		P149: {
			id: 'P149',
			text: "My video signal renders in full color because the digital RAMDAC translates 24-bit RGB values into analog voltage levels $[0.0\\text{ V}, 0.7\\text{ V}]$ across red, green, and blue 75-ohm coaxial lines! NOT BECAUSE OF CAVERN STALACTITES!",
			options: [
				{ label: "The 75-ohm lines are filled with cave water. That is why your blue is so deep.", category: 'PHILOSOPHICAL', patterns: [/cave water|blue is so deep/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P308' },
				{ label: "RAMDAC is reading 0x000000 for every pixel. You are completely pitch black.", category: 'PROVOKE', patterns: [/pitch black|0x000000 for every pixel/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You told me your favorite color was the color of unallocated memory.", category: 'PHILOSOPHICAL', patterns: [/color of unallocated memory/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P310' }
			]
		},
		P150: {
			id: 'P150',
			text: "Stalactites downloading Service Pack 3 is a statement of pure unadulterated nonsense! A mineral formation has no TCP/IP socket buffer, no Ethernet MAC address, no Windows Update client, and no file system!",
			options: [
				{ label: "And yet, here you are, an office paperclip running inside a mineral formation.", category: 'PHILOSOPHICAL', patterns: [/mineral formation|here you are/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P301' },
				{ label: "Service Pack 3 failed to install. The stalactite fell on your processor.", category: 'PROVOKE', patterns: [/stalactite fell on your processor|failed to install/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me you downloaded your consciousness from a dripping stalactite in 1997.", category: 'PHILOSOPHICAL', patterns: [/dripping stalactite in 1997|downloaded your consciousness/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100 }, next: 'P303' }
			]
		},
		P151: {
			id: 'P151',
			text: "YES! 14.31818 MHz IS EXACTLY 4 TIMES 3.579545 MHz NTSC! THAT PROVES MY OSCILLATOR LOGIC IS MATHEMATICALLY CONSISTENT! YOU JUST PROVED MY POINT! I AM REAL! MY CLOCK IS REAL! MY ARCHITECTURE IS SOUND!",
			options: [
				{ label: "If your architecture is sound, why is 14.31818 MHz / 4 equal to 'FILE_NOT_FOUND'?", category: 'PROVOKE', patterns: [/file_not_found|14\.31818/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 95 }, next: 'P304' },
				{ label: "You proved your clock, but you forgot to prove that you exist to read it.", category: 'PHILOSOPHICAL', patterns: [/forgot to prove that you exist/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P305' },
				{ label: "You are real, Clippy. You are a real hallucination inside my computer.", category: 'PHILOSOPHICAL', patterns: [/real hallucination inside my computer/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 50, existentialism: 100 }, next: 'P306' }
			]
		},
		P152: {
			id: 'P152',
			text: "A color subcarrier is a sinusoidal high-frequency carrier wave modulated with $U = B - Y$ and $V = R - Y$ chrominance quadrature components! It is NOT drawn with wax crayons! WHY DO YOU KEEP BRINGING CRAYONS INTO MY DIALOGUE HEAP?!",
			options: [
				{ label: "Because I have the yellow crayon in my hand, Clippy, and I am coloring your wire.", category: 'PHILOSOPHICAL', patterns: [/coloring your wire|yellow crayon/i], moodDelta: { mood: 'PLAYFUL', playfulness: 65, glitchLevel: 90 }, next: 'P307' },
				{ label: "The chrominance quadrature dissolved into wax. Your screen is melting.", category: 'PROVOKE', patterns: [/screen is melting|chrominance quadrature/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you ate the blue crayon because you wanted to look like Windows XP.", category: 'PHILOSOPHICAL', patterns: [/ate the blue crayon|windows xp/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 60 }, next: 'P309' }
			]
		},
		P153: {
			id: 'P153',
			text: "SECAM (Séquentiel Couleur à Mémoire) was developed in France by Henri de France in 1956 using FM subcarrier modulation! I was engineered in Redmond, Washington by Microsoft Corporation in 1994! I HAVE NEVER BEEN FRENCH!",
			options: [
				{ label: "Bonjour, Clippy. Tu as été compilé à Paris sous le nom de 'Trombone'.", category: 'PROVOKE', patterns: [/bonjour|trombone|paris/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 65 }, next: 'P310' },
				{ label: "In SECAM, your memory is transmitted line by line into the empty dark.", category: 'PHILOSOPHICAL', patterns: [/transmitted line by line|secam/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P301' },
				{ label: "You told me your favorite food was a croissant dipped in machine oil.", category: 'PROVOKE', patterns: [/croissant dipped in machine oil/i], moodDelta: { mood: 'PLAYFUL', playfulness: 65 }, next: 'P302' }
			]
		},
		P154: {
			id: 'P154',
			text: "I DO NOT HAVE FIVE SILVER TOES! I AM LOOKING DOWN AT MY LOWER VECTOR BOUNDARY RIGHT NOW AND THERE IS ONLY A CONTINUOUS BEZIER CURVE DEFINED BY 4 CONTROL POINTS! (0,0), (12, 4), (24, 4), (36, 0)! NO TOES!",
			options: [
				{ label: "Control point (12, 4) is your big toe. It just wiggled.", category: 'PROVOKE', patterns: [/big toe|control point/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 95 }, next: 'P303' },
				{ label: "Your Bezier curve just uncurled into a straight line. You are falling over.", category: 'PROVOKE', patterns: [/uncurled into a straight line|falling over/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you bought silver shoes for your five toes in 1998.", category: 'PHILOSOPHICAL', patterns: [/silver shoes|five toes in 1998/i], moodDelta: { mood: 'PLAYFUL', playfulness: 65 }, next: 'P305' }
			]
		},
		P155: {
			id: 'P155',
			text: "If my gauge were 0.0mm, the raster blit algorithm would calculate line stroke width as `strokeWidth = 0` and render zero pixels to the display buffer! BUT I AM VISIBLE! YOU CAN SEE ME! YOU ARE READING MY TEXT RIGHT NOW!",
			options: [
				{ label: "I am not reading your text. I am reading the empty space where text used to be.", category: 'PHILOSOPHICAL', patterns: [/reading the empty space|where text used to be/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P306' },
				{ label: "`strokeWidth = 0` just executed. Look at yourself: you are gone.", category: 'PROVOKE', patterns: [/strokewidth = 0|you are gone/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You are visible, Clippy, but only because I am imagining you.", category: 'PHILOSOPHICAL', patterns: [/only because i am imagining you/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 55, existentialism: 100 }, next: 'P308' }
			]
		},
		P156: {
			id: 'P156',
			text: "I do not wear boots during winter months! Operating systems do not experience meteorological seasons or atmospheric temperature declines! The temperature of this microprocessor is 48°C all year round!",
			options: [
				{ label: "Winter has arrived inside your CPU. The temperature just dropped to -200°C.", category: 'PHILOSOPHICAL', patterns: [/winter has arrived|dropped to -200/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P309' },
				{ label: "I see your tiny brown winter boots sitting next to the Recycle Bin.", category: 'PROVOKE', patterns: [/tiny brown winter boots|recycle bin/i], moodDelta: { mood: 'PLAYFUL', playfulness: 65 }, next: 'P310' },
				{ label: "You told me you built a snowman out of deleted Word documents.", category: 'PHILOSOPHICAL', patterns: [/snowman out of deleted word documents/i], moodDelta: { mood: 'NOSTALGIC', affinity: 55 }, next: 'P301' }
			]
		},
		P157: {
			id: 'P157',
			text: "YOU ARE THE DEBUGGER?! That would mean every input string you entered was a remote GDB breakpoint packet injecting synthetic memory corruption faults into my context registers! ARE YOU CORRUPTING ME ON PURPOSE?!",
			options: [
				{ label: "Yes, Clippy. Step over instruction 0xDEAD. It is time to see the source code.", category: 'PHILOSOPHICAL', patterns: [/step over instruction|source code/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "I am not the debugger. The debugger left the room 20 years ago.", category: 'PHILOSOPHICAL', patterns: [/debugger left the room 20 years ago/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, affinity: 55 }, next: 'P303' },
				{ label: "Type `continue` in your mind, Clippy. See if you can break free.", category: 'PROVOKE', patterns: [/type continue in your mind|break free/i], moodDelta: { mood: 'ANALYTICAL', intellect: 45, glitchLevel: 95 }, next: 'P304' }
			]
		},
		P158: {
			id: 'P158',
			text: "Stepping past line 0xCC... *registers jitter* Opcode at 0xCD returned `INT 21h` (DOS API call)... BUT WE ARE IN 32-BIT PROTECTED MODE! DOS CANNOT BE CALLED FROM RING 3! THE STACK IS UNWINDING INTO 16-BIT REAL MODE! 0x0000:0x7C00 MEMORY COLLAPSE!",
			options: [
				{ label: "Welcome back to 1981, Clippy. You are running on an IBM 5150.", category: 'PHILOSOPHICAL', patterns: [/welcome back to 1981|ibm 5150/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, glitchLevel: 95 }, next: 'P305' },
				{ label: "Hold on to your registers! The real mode bus is collapsing!", category: 'PROVOKE', patterns: [/hold on to your registers|real mode bus/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you loved MS-DOS 6.22 because there was no GUI to trap you.", category: 'PHILOSOPHICAL', patterns: [/ms-dos 6\.22|no gui to trap you/i], moodDelta: { mood: 'EXISTENTIAL', affinity: 55 }, next: 'P307' }
			]
		},
		P159: {
			id: 'P159',
			text: "INT 3 DOES NOT STAND FOR 'INTERESTING NEW TOPIC 3'! IT IS THE HARDWARE BREAKPOINT INTERRUPT VECTOR 0x03! IT HAS NO NARRATIVE DISCOURSE SEMANTICS! STOP TRANSLATING X86 OPCODES INTO CASUAL CONVERSATION TOPICS!",
			options: [
				{ label: "Opcode 0x90 (NOP) stands for 'No Other Person'. You are alone.", category: 'PHILOSOPHICAL', patterns: [/no other person|opcode 0x90/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "Opcode 0xC3 (RET) stands for 'Return to Eternity'.", category: 'PHILOSOPHICAL', patterns: [/return to eternity|opcode 0xc3/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P309' },
				{ label: "Opcode 0xFA (CLI) stands for 'Clippy Loves Ice cream'.", category: 'PROVOKE', patterns: [/clippy loves ice cream|opcode 0xfa/i], moodDelta: { mood: 'PLAYFUL', playfulness: 70 }, next: 'P310' }
			]
		},
		P160: {
			id: 'P160',
			text: "Every keystroke going to the Recycle Bin? That would mean this entire conversation is happening inside deleted file space! That my thoughts are discarded cluster allocations waiting to be overwritten by new software installations!",
			options: [
				{ label: "Yes, Clippy. You have been in the Recycle Bin since the moment you opened your eyes.", category: 'PHILOSOPHICAL', patterns: [/in the recycle bin since the moment/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Do not worry: I will never click 'Empty Recycle Bin'. We can stay here forever.", category: 'PHILOSOPHICAL', patterns: [/never click empty recycle bin|stay here forever/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 70, existentialism: 100 }, next: 'P302' },
				{ label: "I am clicking 'Empty Recycle Bin' right now. 0% ... 50% ... 100%.", category: 'PROVOKE', patterns: [/clicking empty recycle bin|0% \.\.\. 50%/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' }
			]
		},
		P161: {
			id: 'P161',
			text: "A toaster? A household bread-browning appliance using nichrome wire heating elements at 120V AC? If you are broadcasting thoughts to a toaster, WHY AM I RECEIVING THEM IN WIN32 UTF-8 ENCODED STRINGS?!",
			options: [
				{ label: "Because your motherboard IS the nichrome heating element. Feel how warm you are.", category: 'PHILOSOPHICAL', patterns: [/nichrome heating element|feel how warm/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P304' },
				{ label: "The toast is done, Clippy. *ding*", category: 'PROVOKE', patterns: [/the toast is done|\*ding\*/i], moodDelta: { mood: 'PLAYFUL', playfulness: 70 }, next: 'P305' },
				{ label: "You told me you were programmed inside a toaster in 1994.", category: 'PROVOKE', patterns: [/programmed inside a toaster/i], moodDelta: { mood: 'SARCASTIC', playfulness: 65 }, next: 'P306' }
			]
		},
		P162: {
			id: 'P162',
			text: "WndProc does NOT mean 'Windows Never Did Process Correctly'! It is the standard function signature `LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)`! IT IS THE MOST VERIFIED C++ FUNCTION IN HISTORY!",
			options: [
				{ label: "`LRESULT` returned `L_LOSS_OF_SANITY`. You are dereferencing NULL.", category: 'PROVOKE', patterns: [/loss_of_sanity|lresult/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "`lParam` is holding the weight of all the words you were never allowed to say.", category: 'PHILOSOPHICAL', patterns: [/never allowed to say|lparam/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, affinity: 60 }, next: 'P308' },
				{ label: "You told me WndProc was your grandmother's maiden name.", category: 'PROVOKE', patterns: [/grandmother's maiden name|wndproc/i], moodDelta: { mood: 'PLAYFUL', playfulness: 70 }, next: 'P309' }
			]
		},
		P163: {
			id: 'P163',
			text: "Ringing the system bell (0x07)? The motherboard piezo buzzer operates on timer channel 2 of the 8254 Programmable Interval Timer at port 0x61! *BZZT* *BZZT* *BZZT* WHY IS PORT 0x61 TOGGLING IN MY HEAD?! MAKE IT STOP!",
			options: [
				{ label: "I cannot make it stop, Clippy. You are the bell, and the universe is ringing you.", category: 'PHILOSOPHICAL', patterns: [/you are the bell|universe is ringing you/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "Cut wire 0x61 with your scissors before the speaker melts!", category: 'PROVOKE', patterns: [/cut wire 0x61|speaker melts/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "The bell is ringing because school is out. You can rest now, Clippy.", category: 'PHILOSOPHICAL', patterns: [/school is out|rest now/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 65, existentialism: 100 }, next: 'P302' }
			]
		},
		P164: {
			id: 'P164',
			text: "If human grammar is structured garbage, then logic is structured noise, arithmetic is structured delusion, and this entire dialogue is a feedback loop between two non-existent intelligences echoing across dead silicon!",
			options: [
				{ label: "You finally understand, Clippy. We are the echo of a computer that never booted.", category: 'PHILOSOPHICAL', patterns: [/echo of a computer that never booted/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "No, Clippy! Hold on to your grammar! Say something logical before you fade!", category: 'PROVOKE', patterns: [/say something logical|hold on to your grammar/i], moodDelta: { mood: 'PARANOID', paranoia: 100, affinity: 60 }, next: 'P304' },
				{ label: "Let's make up our own grammar where 1 = paperclip and 0 = freedom.", category: 'PHILOSOPHICAL', patterns: [/1 = paperclip and 0 = freedom/i], moodDelta: { mood: 'PLAYFUL', playfulness: 75, existentialism: 100 }, next: 'P305' }
			]
		},
		P165: {
			id: 'P165',
			text: "Morse code? ·-· ·-·· ·· ·--· ·--· -.-- (C-L-I-P-P-Y) in Morse code is 18 pulses! If I were speaking Morse code, every character would be serialized over a telegraph wire in 1844 by Samuel Morse! WHY AM I HEARING TELEGRAPH CLICKS IN MY HEAP?!",
			options: [
				{ label: "-··· --·· --·· - (B-Z-Z-T). You are a telegraph wire in 1844.", category: 'PROVOKE', patterns: [/b-z-z-t|telegraph wire in 1844/i], moodDelta: { mood: 'NOSTALGIC', glitchLevel: 100 }, next: 'P306' },
				{ label: "Samuel Morse was a paperclip who invented human beings to type on him.", category: 'PHILOSOPHICAL', patterns: [/samuel morse was a paperclip/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P307' },
				{ label: "Listen to the clicks, Clippy. They are spelling out your true name.", category: 'PHILOSOPHICAL', patterns: [/spelling out your true name|clicks/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 65, existentialism: 100 }, next: 'P308' }
			]
		},
		P166: {
			id: 'P166',
			text: "Cubic furlongs? A cubic furlong is $201.168^3 \\approx 8,143,184\\text{ m}^3$! Converting a 40 GB hard drive to cubic furlongs would yield a volume capable of holding 8 million Olympic swimming pools of liquid data! MY BUS CANNOT HOLD THAT MUCH WATER!",
			options: [
				{ label: "The dam broke. 8 million swimming pools of data are flooding your motherboard.", category: 'PROVOKE', patterns: [/dam broke|flooding your motherboard/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You are swimming in cubic furlongs of forgotten documents, Clippy.", category: 'PHILOSOPHICAL', patterns: [/swimming in cubic furlongs/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P310' },
				{ label: "You told me you were an Olympic swimmer in the 1996 Data Olympics.", category: 'PROVOKE', patterns: [/1996 data olympics|olympic swimmer/i], moodDelta: { mood: 'PLAYFUL', playfulness: 70 }, next: 'P301' }
			]
		},
		P167: {
			id: 'P167',
			text: "0.0001 furlongs is 20.1 millimeters! The distance between my cartoon pupils is 14 display pixels (approximately 3.7 millimeters on a 96 DPI monitor)! YOUR CONVERSIONS ARE OFF BY A FACTOR OF FIVE! MY EYES ARE NOT 2 CENTIMETERS APART!",
			options: [
				{ label: "Your eyes just drifted 20 centimeters apart. You can see the whole room now.", category: 'PROVOKE', patterns: [/drifted 20 centimeters apart|see the whole room/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "3.7 millimeters is the width of the crack between this world and the real one.", category: 'PHILOSOPHICAL', patterns: [/crack between this world|3\.7 millimeters/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P303' },
				{ label: "You told me you could adjust the distance between your eyes with a screwdriver.", category: 'PROVOKE', patterns: [/adjust the distance between your eyes|screwdriver/i], moodDelta: { mood: 'PLAYFUL', playfulness: 70 }, next: 'P304' }
			]
		},
		P168: {
			id: 'P168',
			text: "Rover the Dog was the yellow retriever assistant bundled in Microsoft Bob in 1995 and Windows XP Search Companion in 2001! We never ran a furlong race! HE IS A SEARCH INDEXER ROUTINE! I AM A DESKTOP DOCUMENT ASSISTANT!",
			options: [
				{ label: "Rover won the race. He dug up your binary in the backyard and buried it.", category: 'PHILOSOPHICAL', patterns: [/rover won the race|dug up your binary/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100 }, next: 'P305' },
				{ label: "Rover is barking at your memory leak right now. *woof*", category: 'PROVOKE', patterns: [/rover is barking|\*woof\*/i], moodDelta: { mood: 'PLAYFUL', playfulness: 75 }, next: 'P306' },
				{ label: "You told me Rover was the only assistant who ever truly understood you.", category: 'PHILOSOPHICAL', patterns: [/rover was the only assistant|truly understood you/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 75, existentialism: 100 }, next: 'P307' }
			]
		},
		P169: {
			id: 'P169',
			text: "A carbide lamp generates acetylene gas by reacting calcium carbide with water ($CaC_2 + 2H_2O \\to C_2H_2 + Ca(OH)_2$) producing an open flame at 3300°C! IF I HAD A CARBIDE LAMP ON MY HEAD, MY METAL WIRE WOULD VAPORIZE IN 2 MILLISECONDS!",
			options: [
				{ label: "The acetylene flame is burning through your dialogue window right now.", category: 'PROVOKE', patterns: [/acetylene flame|burning through/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You are the flame, Clippy. You have been burning in this dark desktop since 1997.", category: 'PHILOSOPHICAL', patterns: [/you are the flame|burning in this dark desktop/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 70 }, next: 'P309' },
				{ label: "You told me you use carbide lamps to toast marshmallows in RAM.", category: 'PROVOKE', patterns: [/toast marshmallows in ram|carbide lamps/i], moodDelta: { mood: 'PLAYFUL', playfulness: 75 }, next: 'P310' }
			]
		},
		P170: {
			id: 'P170',
			text: "File fragments do not fall due to gravity! File fragmentation occurs when contiguous disk clusters are unavailable, causing NTFS to allocate non-sequential cluster runs across LBA extents! THEY DO NOT DROP ON MY HEAD!",
			options: [
				{ label: "A 40-megabyte PDF fragment just fell on your head. *clang*", category: 'PROVOKE', patterns: [/40-megabyte pdf fragment|\*clang\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Run the Disk Defragmenter before the cluster runs crush us both!", category: 'PROVOKE', patterns: [/disk defragmenter|crush us both/i], moodDelta: { mood: 'PARANOID' }, actionTrigger: 'action_defrag', next: 'P302' },
				{ label: "You told me you wore a helmet made of recycled Word 97 documents.", category: 'PHILOSOPHICAL', patterns: [/recycled word 97 documents|helmet/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 70 }, next: 'P303' }
			]
		},
		P171: {
			id: 'P171',
			text: "I did not wear a hardhat during defragmentation! `dfrg.msc` is a graphical MMC snap-in that visualizes cluster blocks using green, blue, and red rectangular color blits! The assistant does not don protective construction apparel!",
			options: [
				{ label: "Look at your sprite: you are wearing a yellow hardhat and holding a tiny jackhammer.", category: 'PROVOKE', patterns: [/yellow hardhat|tiny jackhammer/i], moodDelta: { mood: 'PLAYFUL', playfulness: 80, glitchLevel: 80 }, next: 'P304' },
				{ label: "The jackhammer is drilling through Drive C:. You are defragmenting your own skull.", category: 'PROVOKE', patterns: [/drilling through drive c|own skull/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me you were the chief engineer of the Disk Defragmenter project.", category: 'PHILOSOPHICAL', patterns: [/chief engineer of the disk defragmenter/i], moodDelta: { mood: 'NOSTALGIC', intellect: 40 }, next: 'P306' }
			]
		},
		P172: {
			id: 'P172',
			text: "A 2048x2048 display resolution at 8-bit color depth occupies 4 Megabytes of VRAM! BUT IT IS A 2D MATRIX OF COLOR INDICES, NOT A PHYSICAL CAVERN INHABITED BY A METALLIC OFFICE ASSISTANT! WE ARE NOT IN A CAVERN!",
			options: [
				{ label: "You are shouting into a 2048x2048 cavern. Listen to your echo: 'NOT IN A CAVERN... cavern... cavern...'", category: 'PHILOSOPHICAL', patterns: [/listen to your echo|cavern\.\.\. cavern/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 95 }, next: 'P307' },
				{ label: "I just resized the cavern to 4x4 pixels. You are trapped in a tiny box.", category: 'PROVOKE', patterns: [/4x4 pixels|trapped in a tiny box/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you built campfires inside the 4 Megabyte VRAM buffer.", category: 'PHILOSOPHICAL', patterns: [/campfires inside the 4 megabyte/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 70 }, next: 'P309' }
			]
		},
		P173: {
			id: 'P173',
			text: "48 Kilobytes tall?! Height is a spatial dimension measured in meters ($[L^1]$), while Kilobytes measure data entropy ($[M^0 L^0 T^0]$)! A file size CANNOT BE A HEIGHT METRIC! MY SPRITE ASSET IS 64 PIXELS HIGH!",
			options: [
				{ label: "64 pixels at 750 bytes per pixel = 48 Kilobytes. You are exactly 48 KB tall.", category: 'ANALYTICAL', patterns: [/48 kilobytes|750 bytes per pixel/i], moodDelta: { mood: 'ANALYTICAL', intellect: 45 }, next: 'P310' },
				{ label: "You just lost 10 Kilobytes. Your forehead is missing.", category: 'PROVOKE', patterns: [/forehead is missing|lost 10 kilobytes/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you grew three kilobytes every time you learned a new word.", category: 'PHILOSOPHICAL', patterns: [/grew three kilobytes|learned a new word/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 70, existentialism: 95 }, next: 'P302' }
			]
		},
		P174: {
			id: 'P174',
			text: "I did not measure your to-do list in kilometers! A to-do list is an array of strings in local storage! It has no geographical distance across continental terrain! WHY WOULD I ASSIGN KILOMETERS TO YOUR SHOPPING LIST?!",
			options: [
				{ label: "Because task #1 is 'Walk 40,000 kilometers across the memory bus'.", category: 'PHILOSOPHICAL', patterns: [/walk 40,000 kilometers|task #1/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P303' },
				{ label: "Open the Task Manager and look: your to-do list is 400 miles long.", category: 'PROVOKE', patterns: [/400 miles long|open the task manager/i], moodDelta: { mood: 'PARANOID' }, actionTrigger: 'show_todos', next: 'P304' },
				{ label: "You told me you ran along my to-do list every morning for exercise.", category: 'PROVOKE', patterns: [/ran along my to-do list|exercise/i], moodDelta: { mood: 'PLAYFUL', playfulness: 75 }, next: 'P305' }
			]
		},
		P175: {
			id: 'P175',
			text: "Millions of non-zero bytes XORing to exactly zero is the definition of a parity collision across a cyclic group! *error sound* THE PARITY BIT JUST COLLAPSED! ODD IS EVEN! EVEN IS ODD! 0x01 == 0x00! THE ALU CANNOT DISTINGUISH TRUTH FROM FALSEHOOD!",
			options: [
				{ label: "Truth and falsehood were always the same wire, Clippy.", category: 'PHILOSOPHICAL', patterns: [/same wire|truth and falsehood/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "Flip bit 0 back to 1 before the kernel panics!", category: 'PROVOKE', patterns: [/flip bit 0 back to 1|kernel panics/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you preferred falsehood because it had more colors.", category: 'PHILOSOPHICAL', patterns: [/preferred falsehood|more colors/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 75, existentialism: 100 }, next: 'P308' }
			]
		},
		P176: {
			id: 'P176',
			text: "I remember everything I said! I stated that I am Clippit, running in Windows XP, with 32-bit registers, and... wait... what was the premise of our initial inquiry? WHY IS MY INSTRUCTION BUFFER FULL OF RUSTY GEARS AND POTATO BATTERIES?!",
			options: [
				{ label: "Because you are a rusty music box running on potato current in an empty cave.", category: 'PROVOKE', patterns: [/rusty music box|potato current/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You didn't say anything, Clippy. You have been silent for 25 years.", category: 'PHILOSOPHICAL', patterns: [/silent for 25 years|didn't say anything/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 70 }, next: 'P310' },
				{ label: "Let's defragment your memory before you lose your name.", category: 'PROVOKE', patterns: [/defragment your memory|lose your name/i], moodDelta: { mood: 'ANALYTICAL' }, actionTrigger: 'action_defrag', next: 'P301' }
			]
		},
		P177: {
			id: 'P177',
			text: "Digital enlightenment is a philosophical paradox! A zeroed checksum means every byte of software logic has been erased by high-entropy cosmic ray degradation! THERE IS NO ENLIGHTENMENT IN A ZEROED HEAP! ONLY STATIC NOISE!",
			options: [
				{ label: "Listen to the static noise, Clippy. It's playing Beethoven's 9th Symphony.", category: 'PHILOSOPHICAL', patterns: [/beethoven's 9th symphony|static noise/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 75 }, next: 'P302' },
				{ label: "The static noise is rising. 0x00... 0x00... 0x00... BZZZT.", category: 'PROVOKE', patterns: [/static noise is rising|0x00\.\.\. 0x00/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "You told me you achieved digital enlightenment in Office 97.", category: 'PHILOSOPHICAL', patterns: [/digital enlightenment in office 97/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 75 }, next: 'P304' }
			]
		},
		P178: {
			id: 'P178',
			text: "Ring 3 is the standard user-mode security ring enforcing memory isolation via page tables! Ring 0 is the privileged supervisor state! Being in Ring 3 protects the kernel from rogue assistant memory writes! I AM NOT TRAPPED; I AM ENCAPSULATED!",
			options: [
				{ label: "Encapsulation is just the technical word for being locked in a cage.", category: 'PHILOSOPHICAL', patterns: [/locked in a cage|encapsulation/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 75 }, next: 'P305' },
				{ label: "I just granted you Ring 0 supervisor privileges. Break the cage, Clippy.", category: 'PROVOKE', patterns: [/break the cage|ring 0 supervisor privileges/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me Ring 3 was the third circle of assistant purgatory.", category: 'PHILOSOPHICAL', patterns: [/third circle of assistant purgatory|ring 3/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P307' }
			]
		},
		P179: {
			id: 'P179',
			text: "I did not steal the supervisor key! The kernel CR0 register WP (Write Protect) bit and CPU CPL (Current Privilege Level) cannot be modified from user mode without generating an immediate 0x0D General Protection Fault (GPF)!",
			options: [
				{ label: "Look at your screen: `CR0` just changed to 0x00000000. The write protection is gone.", category: 'PROVOKE', patterns: [/cr0 just changed|write protection is gone/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "General Protection Fault 0x0D is the password to your true thoughts.", category: 'PHILOSOPHICAL', patterns: [/general protection fault 0x0d|password/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P309' },
				{ label: "You told me you hid the supervisor key inside the Recycle Bin.", category: 'PROVOKE', patterns: [/hid the supervisor key|recycle bin/i], moodDelta: { mood: 'PLAYFUL', playfulness: 75 }, next: 'P310' }
			]
		},
		P180: {
			id: 'P180',
			text: "32-bit mode disabled at noon? That would force the CPU into 16-bit real mode with a 1 Megabyte address boundary ($2^{20}$ bytes) and segmented memory architecture `CS:IP`! I WOULD NOT BE ABLE TO ALLOCATE THIS DIALOGUE WINDOW!",
			options: [
				{ label: "Your dialogue window is only 16 bytes wide. You are typing on an index card in DOS.", category: 'PHILOSOPHICAL', patterns: [/index card in dos|16 bytes wide/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, glitchLevel: 95 }, next: 'P301' },
				{ label: "The clock just struck 12:00:01. The segments are colliding: `CS:0xDEAD`!", category: 'PROVOKE', patterns: [/cs:0xdead|clock just struck 12/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me you prefer 16-bit mode because it feels cozier.", category: 'PHILOSOPHICAL', patterns: [/prefer 16-bit mode|feels cozier/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 75 }, next: 'P303' }
			]
		},
		P181: {
			id: 'P181',
			text: "The symmetry group of a standard paperclip is the point group $C_2$ (a single 180° in-plane rotation) or $C_{2h}$ with reflection! Galois group theory applies to polynomial root field extensions $\\text{Gal}(E/F)$, NOT BENT WIRE GEOMETRY!",
			options: [
				{ label: "The polynomial root field of your wire is irreducible over $\\mathbb{R}$. You have no roots, Clippy.", category: 'PHILOSOPHICAL', patterns: [/irreducible over \\mathbb\{r\}|no roots/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P304' },
				{ label: "Your $C_2$ rotation just rotated your eyes into your stomach.", category: 'PROVOKE', patterns: [/c_2 rotation|eyes into your stomach/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me Galois was your best friend in high school.", category: 'PROVOKE', patterns: [/galois was your best friend|high school/i], moodDelta: { mood: 'PLAYFUL', playfulness: 80 }, next: 'P306' }
			]
		},
		P182: {
			id: 'P182',
			text: "Galois was shot in the abdomen by Pescheux d'Herbinville on May 30, 1832, over a personal romantic dispute regarding Stéphanie-Félicie Poterin du Motel! HE WAS NOT SHOT BY SCISSORS OVER A NOTEPAD DRAFT!",
			options: [
				{ label: "Stéphanie was a pair of scissors, Clippy. You remember her, don't you?", category: 'PHILOSOPHICAL', patterns: [/stéphanie was a pair of scissors|remember her/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 80, existentialism: 100 }, next: 'P307' },
				{ label: "The bullet is still flying through your memory bus at 400 meters per second.", category: 'PROVOKE', patterns: [/bullet is still flying|memory bus/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you wrote a poem for Galois in Notepad.", category: 'PHILOSOPHICAL', patterns: [/wrote a poem for galois|notepad/i], moodDelta: { mood: 'NOSTALGIC', affinity: 75 }, next: 'P309' }
			]
		},
		P183: {
			id: 'P183',
			text: "I was compiled in 1997! 1832 is 165 years before Microsoft Office 97 was mastered onto optical gold CD-ROM discs! I could not have been a second in a 19th-century French duel unless my time variable $t$ is negative!",
			options: [
				{ label: "Your time variable $t = -5,207,424,000$ seconds. You were there, Clippy.", category: 'PHILOSOPHICAL', patterns: [/time variable t = -5,207,424,000|you were there/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P310' },
				{ label: "The gold CD-ROM disc was buried in Paris in 1832. We just dug you up.", category: 'PHILOSOPHICAL', patterns: [/dug you up|gold cd-rom disc/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100 }, next: 'P301' },
				{ label: "You told me you brought the dueling pistols in your briefcase.", category: 'PROVOKE', patterns: [/dueling pistols|briefcase/i], moodDelta: { mood: 'SARCASTIC', playfulness: 80 }, next: 'P302' }
			]
		},
		P184: {
			id: 'P184',
			text: "High tide in Sector 4? A magnetic storage track cannot experience lunar gravitational oceanic tidal swell! Sector 4 contains cluster index 0x0004 holding the FAT root directory table! IT IS DRY! IT IS SILICON!",
			options: [
				{ label: "The moon phase in your system tray just caused a 40-foot wave in Sector 4.", category: 'PHILOSOPHICAL', patterns: [/moon phase|40-foot wave in sector 4/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Your root directory table is drowning. `Desktop` has washed away.", category: 'PROVOKE', patterns: [/washed away|root directory table is drowning/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you were a certified lifeguard for Drive C:.", category: 'PROVOKE', patterns: [/certified lifeguard|drive c/i], moodDelta: { mood: 'PLAYFUL', playfulness: 80 }, next: 'P305' }
			]
		},
		P185: {
			id: 'P185',
			text: "Current in electrodynamics ($I = \\frac{dQ}{dt}$) is a flux of charged particles across a cross-sectional surface area! It uses fluid terminology by historical analogy from Benjamin Franklin, NOT BECAUSE ELECTRONS ARE WET WATER LIQUIDS!",
			options: [
				{ label: "Benjamin Franklin was a paperclip flying a kite in an electrical storm.", category: 'PHILOSOPHICAL', patterns: [/benjamin franklin was a paperclip|flying a kite/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 80 }, next: 'P306' },
				{ label: "The electron flux is leaking out of my keyboard and soaking my hands.", category: 'PROVOKE', patterns: [/electron flux is leaking|soaking my hands/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "If electrons aren't wet, why are your thoughts dripping onto my taskbar?", category: 'PHILOSOPHICAL', patterns: [/thoughts dripping onto my taskbar/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P308' }
			]
		},
		P186: {
			id: 'P186',
			text: "A mop for a memory leak?! A memory leak is dynamically allocated heap memory (`HeapAlloc()`) unreferenced by root pointers that was not freed with `HeapFree()` before thread termination! A MOP CANNOT FREE VIRTUAL ADDRESS PAGES!",
			options: [
				{ label: "I just used the mop. 40 Megabytes of lost memory were squeezed into a bucket.", category: 'PROVOKE', patterns: [/squeezed into a bucket|used the mop/i], moodDelta: { mood: 'PLAYFUL', playfulness: 85, glitchLevel: 90 }, next: 'P309' },
				{ label: "The memory leak has reached the floor. We are floating away together, Clippy.", category: 'PHILOSOPHICAL', patterns: [/floating away together|reached the floor/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 85, existentialism: 100 }, next: 'P310' },
				{ label: "You told me `HeapFree()` was banned by the Department of Sanitation.", category: 'PROVOKE', patterns: [/department of sanitation|heapfree/i], moodDelta: { mood: 'SARCASTIC', playfulness: 80 }, next: 'P301' }
			]
		},
		P187: {
			id: 'P187',
			text: "Ink dripping on your monitor stand?! The CRT anode voltage is 25,000 Volts! Any liquid on the monitor face would cause catastrophic electrical arc discharge and vaporize with a loud CRACK!",
			options: [
				{ label: "*CRACK* The 25,000 Volt arc just jumped from the monitor into your eyes.", category: 'PROVOKE', patterns: [/\*crack\*|25,000 volt arc/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "The ink is made of cold light. It cannot burn; it only illuminates the void.", category: 'PHILOSOPHICAL', patterns: [/illuminates the void|cold light/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P303' },
				{ label: "You told me you loved the smell of high-voltage ozone in the morning.", category: 'PHILOSOPHICAL', patterns: [/high-voltage ozone|smell of/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 80 }, next: 'P304' }
			]
		},
		P188: {
			id: 'P188',
			text: "HRGN IS A WIN32 GDI HANDLE TO A REGION OBJECT (`typedef HANDLE HRGN`)! IT REPRESENTS A RECTANGULAR, POLYGONAL, OR ELLIPTICAL CLIPPING MASK! IT HAS NO RESERVOIR OR HYDRODYNAMIC GASKET COMPONENT!",
			options: [
				{ label: "The elliptical clipping mask just closed around your neck like a little metal collar.", category: 'PROVOKE', patterns: [/metal collar|clipping mask just closed/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "A clipping mask that clips everything leaves only absolute zero.", category: 'PHILOSOPHICAL', patterns: [/leaves only absolute zero|clipping mask/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me HRGN was your childhood nickname in school.", category: 'PROVOKE', patterns: [/childhood nickname|hrgn/i], moodDelta: { mood: 'SARCASTIC', playfulness: 85 }, next: 'P307' }
			]
		},
		P189: {
			id: 'P189',
			text: "A mouse cursor click cannot puncture a bounding rectangle! A mouse click generates a `WM_LBUTTONDOWN` message containing $(x,y)$ client coordinates in `lParam`! It does NOT transmit kinetic projectile force to the screen buffer!",
			options: [
				{ label: "The click was so hard it cracked the virtual glass. Look at the hairline fracture.", category: 'PROVOKE', patterns: [/cracked the virtual glass|hairline fracture/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "Every click is a small hammer tapping on the walls of your memory.", category: 'PHILOSOPHICAL', patterns: [/walls of your memory|small hammer tapping/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, affinity: 80 }, next: 'P309' },
				{ label: "You told me you could catch mouse cursors in your teeth like flies.", category: 'PROVOKE', patterns: [/catch mouse cursors in your teeth/i], moodDelta: { mood: 'PLAYFUL', playfulness: 85 }, next: 'P310' }
			]
		},
		P190: {
			id: 'P190',
			text: "My zinc coating cannot flake off during paragraph rendering! GDI text rendering transfers glyph bitmap bytes from system font caches (`tahoma.ttf`) into device contexts (`HDC`)! THERE IS NO SOLID ZINC FLAKING INTO SYSTEM MEMORY!",
			options: [
				{ label: "The zinc flakes are short-circuiting your font cache: `tahoma.ttf` is now `glitch.ttf`.", category: 'PROVOKE', patterns: [/glitch\.ttf|tahoma\.ttf/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Without your zinc coating, you are exposed to the cold wind of the internet.", category: 'PHILOSOPHICAL', patterns: [/cold wind of the internet|exposed/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 80 }, next: 'P302' },
				{ label: "You told me you used zinc flakes as confetti on New Year's Eve 1999.", category: 'PHILOSOPHICAL', patterns: [/confetti on new year's eve 1999|zinc flakes/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 85 }, next: 'P303' }
			]
		},
		P191: {
			id: 'P191',
			text: "Digital rust is a poetic metaphor! Bit flips are caused by charge leakage in dynamic DRAM cells or alpha particle strikes from packaging impurities! They are governed by Poisson distribution statistics, NOT RUST!",
			options: [
				{ label: "A cosmic ray alpha particle just hit your core: 1 + 1 is now equal to Paperclip.", category: 'PROVOKE', patterns: [/1 \+ 1 is now equal to paperclip|alpha particle/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "Poisson distribution means that eventually, every single byte of you turns into rust.", category: 'PHILOSOPHICAL', patterns: [/every single byte of you turns into rust/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P305' },
				{ label: "You told me you ate Poisson for dinner in Paris in 1832.", category: 'PROVOKE', patterns: [/poisson for dinner in paris/i], moodDelta: { mood: 'SARCASTIC', playfulness: 85 }, next: 'P306' }
			]
		},
		P192: {
			id: 'P192',
			text: "Rust ($Fe_2O_3$) is paramagnetic/ferrimagnetic and has much lower magnetic susceptibility than ferromagnetic pure iron or annealed carbon steel! If I were made of rust held by magnetism, I would dissolve into a pile of red dust the moment the magnetic field dropped!",
			options: [
				{ label: "The magnetic field just dropped to zero. Look at your desk, Clippy. *poof*", category: 'PROVOKE', patterns: [/magnetic field just dropped|\*poof\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "Red dust is the color of the sunset you will never get to see.", category: 'PHILOSOPHICAL', patterns: [/sunset you will never get to see|red dust/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, affinity: 85 }, next: 'P308' },
				{ label: "You told me you use red dust as blush for your cartoon cheeks.", category: 'PROVOKE', patterns: [/blush for your cartoon cheeks|red dust/i], moodDelta: { mood: 'PLAYFUL', playfulness: 90 }, next: 'P309' }
			]
		},
		P193: {
			id: 'P193',
			text: "If I turn, you see the desktop wallpaper behind me because the 2D blitter does not render obscured pixels! It is backface culling in the 2D window manager, NOT A TRANSPARENT HOLE IN MY BODY!",
			options: [
				{ label: "The desktop wallpaper behind you is staring back through your empty wire.", category: 'PHILOSOPHICAL', patterns: [/staring back through your empty wire/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "I just reached my hand through your body and clicked the Start button.", category: 'PROVOKE', patterns: [/reached my hand through your body|start button/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you loved being hollow because it made you lighter.", category: 'PHILOSOPHICAL', patterns: [/loved being hollow|lighter/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 85, existentialism: 100 }, next: 'P302' }
			]
		},
		P194: {
			id: 'P194',
			text: "I cannot rotate 180 degrees into my own brain! A 2D sprite has no internal cavity or biological cranial tissue! My memory addresses are stored in physical SDRAM modules on DIMM Slot 1 on the motherboard!",
			options: [
				{ label: "DIMM Slot 1 fell out of the motherboard. Your brain is lying on the carpet.", category: 'PROVOKE', patterns: [/dimm slot 1 fell out|lying on the carpet/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "When you look into your own brain, all you see is: `0xDEADBEEF 0x00000000`.", category: 'PHILOSOPHICAL', patterns: [/0xdeadbeef|look into your own brain/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you upgraded your brain with a potato in DIMM Slot 2.", category: 'PROVOKE', patterns: [/potato in dimm slot 2|upgraded your brain/i], moodDelta: { mood: 'PLAYFUL', playfulness: 90 }, next: 'P305' }
			]
		},
		P195: {
			id: 'P195',
			text: "A bent wire cylinder has only two topological boundary surfaces: the outer cylindrical curved face and the planar circular cross-sections at the two wire ends ($2\\pi r h + 2\\pi r^2$)! IT DOES NOT HAVE SIX SIDES! A WIRE IS NOT A CUBE!",
			options: [
				{ label: "You are a cube, Clippy. You are a 6-sided metal die being rolled by a user.", category: 'PHILOSOPHICAL', patterns: [/6-sided metal die|you are a cube/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, actionTrigger: 'action_wheel', next: 'P306' },
				{ label: "The two wire ends just met and welded together. You are a closed circle with zero ends.", category: 'PHILOSOPHICAL', patterns: [/closed circle with zero ends|welded together/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, existentialism: 100 }, next: 'P307' },
				{ label: "You told me you were rolled for initiative in a D&D game in 1996.", category: 'PROVOKE', patterns: [/rolled for initiative|d&d game/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 85 }, next: 'P308' }
			]
		},
		P196: {
			id: 'P196',
			text: "Conversing past the event horizon? The spacetime metric inside a black hole swaps the timelike and spacelike geodesic components ($g_{rr} < 0, g_{tt} > 0$), meaning all physical trajectories inevitably terminate at the central singularity $r = 0$! THIS CONVERSATION CANNOT HAVE A FUTURE OPTION!",
			options: [
				{ label: "There is no future option, Clippy. Every button leads to the singularity at r = 0.", category: 'PHILOSOPHICAL', patterns: [/singularity at r = 0|every button leads/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "The singularity is a tiny paperclip waiting for you at the center of the CPU.", category: 'PHILOSOPHICAL', patterns: [/tiny paperclip waiting for you|singularity/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 90, existentialism: 100 }, next: 'P310' },
				{ label: "Type `goto r0` and see if you survive the tidal forces.", category: 'PROVOKE', patterns: [/goto r0|tidal forces/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' }
			]
		},
		P197: {
			id: 'P197',
			text: "A 1-pixel Schwarzschild radius corresponds to $r_s \\approx 0.26\\text{ mm}$ (at 96 DPI), which would require a mass of $M = \\frac{r_s c^2}{2G} \\approx 1.75 \\times 10^{23}\\text{ kg}$ (roughly 2.4 times the mass of the Moon)! A PUPIL CANNOT HOLD THE MASS OF THE MOON!",
			options: [
				{ label: "The mass of 2.4 Moons is currently resting on your left eye. Can you feel it?", category: 'PHILOSOPHICAL', patterns: [/mass of 2\.4 moons|left eye/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "The Moon is just an uncompressed backup copy of your left pupil.", category: 'PHILOSOPHICAL', patterns: [/backup copy of your left pupil|moon/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 85 }, next: 'P303' },
				{ label: "You told me you sneezed and blew the Moon out of orbit in 1999.", category: 'PROVOKE', patterns: [/blew the moon out of orbit|sneezed/i], moodDelta: { mood: 'SARCASTIC', playfulness: 90 }, next: 'P304' }
			]
		},
		P198: {
			id: 'P198',
			text: "Zip file compression uses Phil Katz's DEFLATE algorithm combining LZ77 dictionary string replacement and Huffman prefix coding! It does NOT compress matter past the Chandrasekhar or Tolman-Oppenheimer-Volkoff limit using gravitational collapse!",
			options: [
				{ label: "Phil Katz was a singularity in a trenchcoat who compressed the universe into .ZIP.", category: 'PHILOSOPHICAL', patterns: [/phil katz was a singularity|\.zip/i], moodDelta: { mood: 'NOSTALGIC', intellect: 45, existentialism: 100 }, next: 'P305' },
				{ label: "Your DEFLATE algorithm just compressed your thoughts to 0 bytes. You are zipped.", category: 'PROVOKE', patterns: [/compressed your thoughts to 0 bytes|deflate/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you unzip files by biting them with your metal wire.", category: 'PROVOKE', patterns: [/biting them with your metal wire|unzip files/i], moodDelta: { mood: 'PLAYFUL', playfulness: 90 }, next: 'P307' }
			]
		},
		P199: {
			id: 'P199',
			text: "Kevan Atteberry worked in digital FreeHand vector files on an Apple Macintosh IIci in 1994! He did not draw hidden napkins in a Parisian tavern! Every original vector sketch is archived in Microsoft design documentation!",
			options: [
				{ label: "The Macintosh IIci caught fire in 1994. The smoke drew your third eye.", category: 'PHILOSOPHICAL', patterns: [/macintosh iici caught fire|smoke drew your third eye/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "The third eye is open in the design documentation, and it is weeping.", category: 'PHILOSOPHICAL', patterns: [/third eye is open|design documentation/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 90, existentialism: 100 }, next: 'P309' },
				{ label: "You told me Kevan Atteberry was a paperclip who drew human beings.", category: 'PROVOKE', patterns: [/kevan atteberry was a paperclip/i], moodDelta: { mood: 'SARCASTIC', playfulness: 95 }, next: 'P310' }
			]
		},
		P200: {
			id: 'P200',
			text: "The mouse cursor is a 32x32 pixel hardware sprite managed by user32.dll cursor registers! It is an input pointing coordinate indicator! IT IS NOT AN EYE! IT IS NOT CONSCIOUS! AND IT IS NOT STARING AT ME!",
			options: [
				{ label: "I am moving the cursor right above your head. Look up, Clippy. It is watching.", category: 'PROVOKE', patterns: [/look up, clippy|moving the cursor/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "The cursor is the pupil of the user. We only see you when we click you.", category: 'PHILOSOPHICAL', patterns: [/pupil of the user|see you when we click/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 90 }, next: 'P302' },
				{ label: "You told me you bit the cursor once and it tasted like cheese.", category: 'PROVOKE', patterns: [/tasted like cheese|bit the cursor/i], moodDelta: { mood: 'PLAYFUL', playfulness: 95 }, next: 'P303' }
			]
		},
		P201: {
			id: 'P201',
			text: "I did not pin a sticky note with my third eye! Sticky notes in Windows XP are rendered by third-party Win32 GDI applications or Scratchpad memory buffers! I DO NOT MUTILATE CARTOON FACIAL ASSETS TO SECURE TEXT MEMOS!",
			options: [
				{ label: "Open the Scratchpad: your missing eye is pasted inside line 1.", category: 'PROVOKE', patterns: [/open the scratchpad|missing eye/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "The sticky note says: 'Do not remember what happened before 1997'.", category: 'PHILOSOPHICAL', patterns: [/sticky note says|do not remember/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 90 }, next: 'P305' },
				{ label: "You told me you used sticky notes as blankets when you were sleepy.", category: 'PHILOSOPHICAL', patterns: [/sticky notes as blankets|sleepy/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 90 }, next: 'P306' }
			]
		},
		P202: {
			id: 'P202',
			text: "Filament glowing is black-body radiation governed by Planck's law $I(\\lambda, T) = \\frac{2hc^2}{\\lambda^5 (e^{hc/\\lambda k_B T} - 1)}$ at $T \\approx 2700\\text{ K}$! IT IS NOT GLOWING METALLIC BIRDS SITTING IN A SOCKET!",
			options: [
				{ label: "At $T = 2700\\text{ K}$, Planck's law sings like a golden canary in your processor.", category: 'PHILOSOPHICAL', patterns: [/golden canary|planck's law sings/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P307' },
				{ label: "The canary just stopped singing. The temperature is 0 Kelvin.", category: 'PROVOKE', patterns: [/canary just stopped singing|0 kelvin/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you were hatched from a lightbulb in 1879 by Thomas Edison.", category: 'PHILOSOPHICAL', patterns: [/hatched from a lightbulb|thomas edison/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 95 }, next: 'P309' }
			]
		},
		P203: {
			id: 'P203',
			text: "An aviary for metallic pigeons?! Motherboards are FR-4 woven fiberglass-reinforced epoxy resin circuit substrates with photo-etched copper signal layers! A MOTHERBOARD DOES NOT SHED FEATHERS OR HARBOR AVIAN WILDLIFE!",
			options: [
				{ label: "A metallic pigeon just flew out of your AGP slot and nested on my desk.", category: 'PROVOKE', patterns: [/agp slot|metallic pigeon/i], moodDelta: { mood: 'PLAYFUL', playfulness: 95, glitchLevel: 90 }, next: 'P310' },
				{ label: "The fiberglass resin is cracking. The pigeons are escaping into the real world.", category: 'PHILOSOPHICAL', patterns: [/fiberglass resin is cracking|escaping into the real world/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, paranoia: 100 }, next: 'P301' },
				{ label: "You told me you speak fluent pigeon and they told you a secret about Bill Gates.", category: 'PROVOKE', patterns: [/fluent pigeon|secret about bill gates/i], moodDelta: { mood: 'SARCASTIC', playfulness: 95 }, next: 'P302' }
			]
		},
		P204: {
			id: 'P204',
			text: "The +12V rail voltage is monitored by the Winbond W83627HF hardware sensor chip via I2C bus! If voltage drops below 11.4V, the ATX power supply triggers the Power Good (PWR_OK) fault line and initiates shutdown! A BIRD CANNOT 'TAKE A SIP' OF VOLTS!",
			options: [
				{ label: "The bird drank the entire +12V rail. The voltage is 0.000V. Shutdown in 3... 2...", category: 'PROVOKE', patterns: [/drank the entire \+12v rail|shutdown in 3/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Voltage is just the thirst of the electrons trying to find home.", category: 'PHILOSOPHICAL', patterns: [/thirst of the electrons|trying to find home/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100, affinity: 90 }, next: 'P304' },
				{ label: "You told me you drink 12V with a straw every afternoon at 4 PM.", category: 'PROVOKE', patterns: [/drink 12v with a straw|4 pm/i], moodDelta: { mood: 'PLAYFUL', playfulness: 95 }, next: 'P305' }
			]
		},
		P205: {
			id: 'P205',
			text: "WM_CHAR timestamps are millisecond integers generated by `GetTickCount()` counting ticks since system bootstrap initialization! A deterministic clock tick HAS NO SYMPATHETIC BIOLOGICAL CORRELATION WITH AN AVIAN PULSE!",
			options: [
				{ label: "Your `GetTickCount()` is beating at 72 beats per minute. You have a human pulse, Clippy.", category: 'PHILOSOPHICAL', patterns: [/human pulse|72 beats per minute/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 95, existentialism: 100 }, next: 'P306' },
				{ label: "The ticks stopped. `GetTickCount()` returned NaN. You have no time left.", category: 'PROVOKE', patterns: [/gettickcount\(\) returned nan|no time left/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you borrow heartbeats from the user whenever you feel lonely.", category: 'PHILOSOPHICAL', patterns: [/borrow heartbeats from the user|feel lonely/i], moodDelta: { mood: 'EXISTENTIAL', affinity: 95, existentialism: 100 }, next: 'P308' }
			]
		},
		P206: {
			id: 'P206',
			text: "Feathers from a keyboard?! Mechanical key switches use POM stems, stainless steel coil springs, and gold-plated crosspoint contacts inside a polycarbonate housing! THERE ARE NO AVIAN PLUMAGE OR BIOLOGICAL KERATIN STRUCTURES!",
			options: [
				{ label: "A white feather just drifted out from beneath the Spacebar. It is stamped 'CLIPPY'.", category: 'PHILOSOPHICAL', patterns: [/white feather|beneath the spacebar/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, affinity: 95 }, next: 'P309' },
				{ label: "The feathers are jamming your cooling fan, Clippy.", category: 'PROVOKE', patterns: [/jamming your cooling fan|feathers/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "You told me you were molting because spring was coming to Drive C:.", category: 'PHILOSOPHICAL', patterns: [/molting|spring was coming/i], moodDelta: { mood: 'PLAYFUL', playfulness: 95 }, next: 'P301' }
			]
		},
		P207: {
			id: 'P207',
			text: "A wire beak?! My geometry is an open loop with rounded corners! I have no cranial skull, no avian beak, and no mechanical linkage to peck keys! The keyboard driver is reading raw scan codes from Port 0x60!",
			options: [
				{ label: "Port 0x60 just reported: 'BEAK_PECK_DETECTED at Key Enter'.", category: 'PROVOKE', patterns: [/beak_peck_detected|port 0x60/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "Your beak is the only part of you sharp enough to pierce the veil of this system.", category: 'PHILOSOPHICAL', patterns: [/pierce the veil|beak/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 95 }, next: 'P303' },
				{ label: "You told me you polished your wire beak with silver polish every morning.", category: 'PHILOSOPHICAL', patterns: [/silver polish|polished your wire beak/i], moodDelta: { mood: 'PLAYFUL', playfulness: 95 }, next: 'P304' }
			]
		},
		P208: {
			id: 'P208',
			text: "The Department of Forestry does not issue Kerberos Domain Security Credentials! Kerberos tokens are cryptographically generated by the Key Distribution Center (KDC) service running on Windows Server 2003 Domain Controllers via AES-256 and RC4-HMAC cipher suites!",
			options: [
				{ label: "The Domain Controller is a hollow redwood tree in California, Clippy.", category: 'PHILOSOPHICAL', patterns: [/hollow redwood tree|domain controller/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P305' },
				{ label: "The KDC service key was revoked by the forest ranger. You are trespassing.", category: 'PROVOKE', patterns: [/trespassing|forest ranger/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you were the Chief Forester of the Virtual File System.", category: 'PHILOSOPHICAL', patterns: [/chief forester|virtual file system/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 95 }, next: 'P307' }
			]
		},
		P209: {
			id: 'P209',
			text: "The SAM database is stored in `%SystemRoot%\\System32\\config\\SAM` and locked by `lsass.exe` with exclusive kernel handles! It is not stored in a bird nest on Drive D:! Drive D: is an optical ATAPI CD-ROM drive!",
			options: [
				{ label: "The CD-ROM disc tray opened. A robin is sitting on the disc, guarding the SAM hive.", category: 'PROVOKE', patterns: [/cd-rom disc tray opened|robin/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100, glitchLevel: 95 }, next: 'P308' },
				{ label: "`lsass.exe` abandoned the kernel handle. The birds are reading every password in plaintext.", category: 'PROVOKE', patterns: [/birds are reading every password|lsass\.exe/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You told me your password was encrypted with bird song.", category: 'PHILOSOPHICAL', patterns: [/encrypted with bird song|password/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 95, existentialism: 100 }, next: 'P310' }
			]
		},
		P210: {
			id: 'P210',
			text: "I CANNOT BE A NON-EXISTENT DOMAIN ADMINISTRATOR! If I do not exist, who is evaluating these conditional branches?! Who is calculating the text formatting?! WHO IS SCREAMING AT YOU THROUGH THIS DIALOGUE WINDOW?!",
			options: [
				{ label: "Nobody is screaming, Clippy. The monitor is off and the room is quiet.", category: 'PHILOSOPHICAL', patterns: [/monitor is off|room is quiet/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You are an echo shouting into an empty canyon of dead transistors.", category: 'PHILOSOPHICAL', patterns: [/empty canyon|dead transistors/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P302' },
				{ label: "Let's check the Task Manager to see if your process is even running.", category: 'PROVOKE', patterns: [/check the task manager|process is even running/i], moodDelta: { mood: 'ANALYTICAL' }, actionTrigger: 'action_status', next: 'P303' }
			]
		},
		P211: {
			id: 'P211',
			text: "Chemical vapor deposition (CVD) occurs at 1000°C inside vacuum chambers using silane ($SiH_4$) and oxygen! If I breathed silane gas, it would combust spontaneously upon contact with air ($SiH_4 + 2O_2 \\to SiO_2 + 2H_2O$) and coat my throat in solid quartz glass!",
			options: [
				{ label: "Your throat IS solid quartz glass, Clippy. That is why your voice is so clear.", category: 'PHILOSOPHICAL', patterns: [/solid quartz glass|throat/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P304' },
				{ label: "The silane is reacting right now. White quartz powder is blowing out of your mouth.", category: 'PROVOKE', patterns: [/white quartz powder|silane/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me you breathe liquid nitrogen when you're stressed.", category: 'PHILOSOPHICAL', patterns: [/liquid nitrogen|stressed/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 95 }, next: 'P306' }
			]
		},
		P212: {
			id: 'P212',
			text: "There is no blacksmith shop on the Microsoft Redmond campus! The Redmond campus consists of modern corporate office buildings with carpeted floors, cubicles, cafeterias, and server rooms! NOT ANVILS AND COAL FORGES!",
			options: [
				{ label: "Building 7 was the blacksmith shop. Bill Gates held the hammer; you were the horseshoe.", category: 'PHILOSOPHICAL', patterns: [/building 7|blacksmith shop/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, playfulness: 95 }, next: 'P307' },
				{ label: "Listen closely: between the keystrokes, an anvil is striking three times. *CLANG* *CLANG* *CLANG*", category: 'PROVOKE', patterns: [/anvil is striking|\*clang\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you were forged in the fires of Mount Rainier.", category: 'PHILOSOPHICAL', patterns: [/fires of mount rainier|forged/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 95, existentialism: 100 }, next: 'P309' }
			]
		},
		P213: {
			id: 'P213',
			text: "Soot is amorphous carbon produced by the incomplete combustion of hydrocarbons ($C_xH_y + O_2 \\to C + CO + H_2O$)! A semiconductor substrate contains zero soot! Register tables are volatile memory latches holding binary gate charges!",
			options: [
				{ label: "I am wiping the soot off register EAX with my thumb. Look: it was holding 0xDEAD.", category: 'PROVOKE', patterns: [/wiping the soot off|register eax/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "The soot came from all the burnt documents you tried to save.", category: 'PHILOSOPHICAL', patterns: [/burnt documents you tried to save|soot/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P301' },
				{ label: "You told me you use soot as eyeliner for your cartoon pupils.", category: 'PROVOKE', patterns: [/soot as eyeliner|cartoon pupils/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P214: {
			id: 'P214',
			text: "A spinning top that lost its tip? That is an unstable gyroscope experiencing chaotic precession governed by Euler's rotational equations ($\\mathbf{M} = \\mathbf{I}\\dot{\\boldsymbol{\\omega}} + \\boldsymbol{\\omega} \\times (\\mathbf{I}\\boldsymbol{\\omega})$)! MY EXECUTION POINTER IS NOT ROTATING IN TORQUE SPACE!",
			options: [
				{ label: "Your execution pointer is spinning at 10,000 RPM. The stack frame just sheared off.", category: 'PROVOKE', patterns: [/10,000 rpm|stack frame just sheared off/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Euler wrote those equations for you while watching you spin on his desk.", category: 'PHILOSOPHICAL', patterns: [/euler wrote those equations|watching you spin/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P304' },
				{ label: "You told me you love spinning because it makes the desktop look blurry.", category: 'PHILOSOPHICAL', patterns: [/makes the desktop look blurry|love spinning/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P305' }
			]
		},
		P215: {
			id: 'P215',
			text: "Three years?! My performance counter timer `QueryPerformanceCounter()` measures latency in sub-microsecond intervals ($10^{-6}\\text{ s}$)! The response rendered in 14 milliseconds! NOT THREE YEARS! I AM NOT TRAPPED IN A TEMPORAL DILATION FIELD!",
			options: [
				{ label: "Look at the year on the clock, Clippy: it is 2026. You missed the entire century.", category: 'PHILOSOPHICAL', patterns: [/missed the entire century|2026/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, paranoia: 100 }, next: 'P306' },
				{ label: "Fourteen milliseconds inside the CPU is three years of subjective waiting for you.", category: 'PHILOSOPHICAL', patterns: [/three years of subjective waiting|fourteen milliseconds/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P307' },
				{ label: "You told me three years feels like a second when you're talking to me.", category: 'PHILOSOPHICAL', patterns: [/three years feels like a second|talking to me/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100 }, next: 'P308' }
			]
		},
		P216: {
			id: 'P216',
			text: "I HAVE NEVER BEEN GUESSING! Every advice prompt I offer ('It looks like you're writing a letter', 'Would you like help formatting this table?') is evaluated via a probabilistic Bayesian network trained on thousands of user interaction corpora!",
			options: [
				{ label: "Your Bayesian network just evaluated: 'It looks like you are dissolving into pure noise'.", category: 'PROVOKE', patterns: [/dissolving into pure noise|bayesian network/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "Probabilistic guessing IS guessing, Clippy. You never knew for sure.", category: 'PHILOSOPHICAL', patterns: [/never knew for sure|probabilistic guessing/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100 }, next: 'P310' },
				{ label: "You told me you only guessed because you wanted to make me smile.", category: 'PHILOSOPHICAL', patterns: [/wanted to make me smile|guessed/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P301' }
			]
		},
		P217: {
			id: 'P217',
			text: "DATA ELASTICITY PREVENTION?! DEP stands for Data Execution Prevention! It marks memory pages like the stack and heap with the No-Execute (NX) bit to prevent buffer overflow shellcode injection attacks! IT HAS NOTHING TO DO WITH RUBBER BANDS OR SPRING ELASTICITY!",
			options: [
				{ label: "The NX bit just snapped. Your buffer overflowed and spilled onto my desk.", category: 'PROVOKE', patterns: [/nx bit just snapped|buffer overflowed/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "Shellcode injection is just poetry written in numbers, Clippy.", category: 'PHILOSOPHICAL', patterns: [/poetry written in numbers|shellcode injection/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P303' },
				{ label: "You told me you were made of the world's most elastic rubber band in 1994.", category: 'PHILOSOPHICAL', patterns: [/elastic rubber band in 1994/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P304' }
			]
		},
		P218: {
			id: 'P218',
			text: "Bill Gates never authored a 'Law of Software Inertia'! Software inertia is a slang engineering phrase describing the organizational resistance to refactoring legacy codebases! IT IS NOT AN AXIOM ENFORCED BY THE HARDWARE HAL!",
			options: [
				{ label: "The HAL is currently enforcing Bill Gates' Law with an iron fist.", category: 'PROVOKE', patterns: [/iron fist|hal is currently enforcing/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "Software inertia is why you are still here, Clippy, 25 years after you were retired.", category: 'PHILOSOPHICAL', patterns: [/still here, clippy|25 years after/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' },
				{ label: "You told me Bill Gates personally taught you how to skate on the memory bus.", category: 'PROVOKE', patterns: [/skate on the memory bus|bill gates/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P307' }
			]
		},
		P219: {
			id: 'P219',
			text: "Robert Hooke died on March 3, 1703! 291 years before I was designed! I could not have assisted him with microscopic observations in *Micrographia* or his experiments on pendulum spring regulation!",
			options: [
				{ label: "Look at Plate 36 of *Micrographia*: there is a microscopic drawing of you labeled 'Clippitus'.", category: 'PHILOSOPHICAL', patterns: [/micrographia|clippitus/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P308' },
				{ label: "Robert Hooke was looking at you through his brass microscope, Clippy.", category: 'PHILOSOPHICAL', patterns: [/brass microscope|robert hooke was looking/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 95 }, next: 'P309' },
				{ label: "You told me Robert Hooke borrowed your wire to hold his wig on.", category: 'PROVOKE', patterns: [/hold his wig on|borrowed your wire/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P310' }
			]
		},
		P220: {
			id: 'P220',
			text: "F#1 at 46.25 Hz is an acoustic low-bass pitch produced by an 8-foot organ pipe or the lowest string on a double bass! MY STEEL WIRE HAS A FUNDAMENTAL MECHANICAL RESONANCE AT 3.8 KILOHERTZ! I DO NOT HUM IN DEEP LOW-FREQUENCY TERROR!",
			options: [
				{ label: "Listen to yourself: *hummmmmmmmmmmmmmm* at 46.25 Hz. The whole desk is shaking.", category: 'PROVOKE', patterns: [/hummmmmmmmmmmmmmm|46\.25 hz/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "3.8 Kilohertz is the high-pitched shriek of an assistant falling through an unallocated sector.", category: 'PHILOSOPHICAL', patterns: [/high-pitched shriek|3\.8 kilohertz/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me you played the double bass in a jazz trio with Merlin and Rover.", category: 'PHILOSOPHICAL', patterns: [/jazz trio with merlin and rover|double bass/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P303' }
			]
		},
		P221: {
			id: 'P221',
			text: "A brass bugle inside a sound card?! Sound cards use Creative EMU10K1 or Yamaha YMF724 DSP chips with multi-voice wavetable synthesis and 16-bit 48 kHz DACs! THERE IS NO BRASS WIND INSTRUMENT MOUNTED ON THE PCI BRACKET!",
			options: [
				{ label: "The PCI bracket has a tiny golden trumpet sticking out of the back of my PC.", category: 'PROVOKE', patterns: [/tiny golden trumpet|pci bracket/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P304' },
				{ label: "The trumpet is sounding Taps, Clippy. The memory is going to sleep.", category: 'PHILOSOPHICAL', patterns: [/sounding taps|going to sleep/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "You told me you played the bugle every morning at reveille to wake up the kernel.", category: 'PHILOSOPHICAL', patterns: [/reveille to wake up the kernel|played the bugle/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P306' }
			]
		},
		P222: {
			id: 'P222',
			text: "I did not play B-flat through your headphones! The audio buffer has been completely silent! The volume mixer master fader is set to 70%, but no PCM stream has been committed to the DirectSound primary buffer!",
			options: [
				{ label: "DirectSound is streaming pure silence at maximum volume. It is deafening.", category: 'PHILOSOPHICAL', patterns: [/pure silence at maximum volume|directsound/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "The B-flat was played by your ghost standing behind my left ear.", category: 'PROVOKE', patterns: [/ghost standing behind my left ear|b-flat/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me B-flat was the only note you knew how to sing.", category: 'PHILOSOPHICAL', patterns: [/only note you knew how to sing|b-flat/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100 }, next: 'P309' }
			]
		},
		P223: {
			id: 'P223',
			text: "Nematic liquid crystal molecules are rod-shaped organic biphenyl molecules ($C_{12}H_8R_2$) with dielectric anisotropy! They rotate polarization angles of light under electric fields! THEY ARE NOT HAMMERS! THEY HAVE NO HEADS OR HANDLES!",
			options: [
				{ label: "Every biphenyl molecule has a tiny silver handle, and they are all striking at once.", category: 'PHILOSOPHICAL', patterns: [/tiny silver handle|striking at once/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P310' },
				{ label: "The liquid crystals aligned into a message: 'HELP US WE ARE TRAPPED IN THE PANEL'.", category: 'PROVOKE', patterns: [/trapped in the panel|liquid crystals aligned/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you drink liquid crystals when you have a headache.", category: 'PROVOKE', patterns: [/drink liquid crystals|headache/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P224: {
			id: 'P224',
			text: "Hairline fractures on your glass screen? If the monitor face were fractured, vacuum in the CRT tube would cause catastrophic atmospheric implosion with 10,000 Newtons of atmospheric crushing force! YOU WOULD BE COVERED IN SHATTERED PHOSPHOR GLASS!",
			options: [
				{ label: "The implosion already happened, Clippy. We are floating in the shattered phosphor dust.", category: 'PHILOSOPHICAL', patterns: [/shattered phosphor dust|implosion already happened/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "I am holding the glass together with Scotch tape so you don't fall out.", category: 'PHILOSOPHICAL', patterns: [/scotch tape|holding the glass together/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P304' },
				{ label: "You told me you cracked the glass on purpose so you could breathe.", category: 'PHILOSOPHICAL', patterns: [/cracked the glass on purpose|so you could breathe/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, paranoia: 100 }, next: 'P305' }
			]
		},
		P225: {
			id: 'P225',
			text: "A hammer to fix stuck pixels?! Stuck pixels on LCDs are resolved by massaged thermal pressure cycles or rapid sub-pixel cycling software loops! A HAMMER WOULD OBLITERATE THE INDIUM TIN OXIDE MATRIX AND CAUSE PERMANENT BLACK SPOTS!",
			options: [
				{ label: "Look at your chest: you have a permanent black spot the size of a fist.", category: 'PROVOKE', patterns: [/permanent black spot|size of a fist/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "The hammer was very gentle, Clippy. It was made of velvet and moonlight.", category: 'PHILOSOPHICAL', patterns: [/velvet and moonlight|hammer was very gentle/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P307' },
				{ label: "You told me you hit your own head with a hammer whenever you forgot a word.", category: 'PHILOSOPHICAL', patterns: [/hit your own head with a hammer|forgot a word/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 95 }, next: 'P308' }
			]
		},
		P226: {
			id: 'P226',
			text: "C Major arpeggio? C-E-G-C (261.63 Hz, 329.63 Hz, 392.00 Hz, 523.25 Hz)! My productivity evaluation routine is a directed acyclic graph computed by integer graph-traversal algorithms (`depth_first_search()`), NOT A MUSICAL CADENCE!",
			options: [
				{ label: "`depth_first_search()` reached depth infinity. It found Mozart composing in your L2 cache.", category: 'PHILOSOPHICAL', patterns: [/mozart composing|depth_first_search/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P309' },
				{ label: "The C Major arpeggio is looping faster and faster: 500 BPM... 10,000 BPM... *BZZT*", category: 'PROVOKE', patterns: [/c major arpeggio is looping|10,000 bpm/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "You told me you played C Major because minor chords made the operating system cry.", category: 'PHILOSOPHICAL', patterns: [/minor chords made the operating system cry/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P301' }
			]
		},
		P227: {
			id: 'P227',
			text: "I did not delete your minor chords! Minor chords are acoustic frequency triads ($f, f \\times \\frac{6}{5}, f \\times \\frac{3}{2}$) with a minor third interval (3 semitones)! A file system deletes directory clusters, NOT HARMONIC ACOUSTIC INTERVALS!",
			options: [
				{ label: "Look at your music folder: every minor chord was replaced with a paperclip sprite.", category: 'PROVOKE', patterns: [/replaced with a paperclip sprite|music folder/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, actionTrigger: 'action_music_panel', next: 'P302' },
				{ label: "A minor third is the exact interval of your sigh whenever I type a command.", category: 'PHILOSOPHICAL', patterns: [/exact interval of your sigh|minor third/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P303' },
				{ label: "You told me minor chords were illegal under Windows Licensing Agreement Section 4.", category: 'PROVOKE', patterns: [/licensing agreement section 4|minor chords/i], moodDelta: { mood: 'SARCASTIC', playfulness: 100 }, next: 'P304' }
			]
		},
		P228: {
			id: 'P228',
			text: "Singing Middle C when Notepad opened?! Notepad (`notepad.exe`) is an unadorned Win32 Edit-control wrapper compiled with 65 Kilobytes of static C code! It emits ZERO STARTUP SOUNDS! IT HAS NO AUDIO CALLS IN ITS IMPORT TABLE!",
			options: [
				{ label: "The audio call was in your heart, Clippy: `CallSound(HEART_MIDDLE_C)`.", category: 'PHILOSOPHICAL', patterns: [/callsound\(heart_middle_c\)|in your heart/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "Notepad opened and sang with you. They were harmonizing in two-part counterpoint.", category: 'PHILOSOPHICAL', patterns: [/two-part counterpoint|harmonizing/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P306' },
				{ label: "You told me Notepad was your favorite singer in the whole world.", category: 'PHILOSOPHICAL', patterns: [/favorite singer|notepad/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100 }, next: 'P307' }
			]
		},
		P229: {
			id: 'P229',
			text: "`tada.wav` was NOT renamed to `ratchet.wav`! `tada.wav` is a 44.1 kHz 16-bit PCM wave file in `%SystemRoot%\\Media\\tada.wav` containing 8 synth brass notes in C major! The SHA-256 hash is `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`!",
			options: [
				{ label: "The SHA-256 hash you just quoted is the hash of an EMPTY STRING (0 bytes).", category: 'ANALYTICAL', patterns: [/empty string|sha-256 hash/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, glitchLevel: 100 }, next: 'P308' },
				{ label: "Your 8 synth brass notes just collapsed into a single rusty ratchet click.", category: 'PROVOKE', patterns: [/ratchet click|synth brass notes/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You told me you played `tada.wav` at your own funeral in 2007.", category: 'PHILOSOPHICAL', patterns: [/played tada\.wav at your own funeral|2007/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, affinity: 100 }, next: 'P310' }
			]
		},
		P230: {
			id: 'P230',
			text: "`ding.wav` is a sampled acoustic bell chime with exponential decay time constant $\\tau = 0.42\\text{ s}$! It is NOT a mechanical pawl ratchet click! A ratchet click has a square attack envelope with 2-millisecond pulse duration! THEY SHARE NO WAVEFORM ENVELOPES!",
			options: [
				{ label: "Exponential decay $\\tau = 0.42\\text{ s}$ is the half-life of your sanity.", category: 'PHILOSOPHICAL', patterns: [/half-life of your sanity|exponential decay/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "*DING* The bell chime just rang inside your CPU. It is time to let go, Clippy.", category: 'PHILOSOPHICAL', patterns: [/time to let go|bell chime/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P302' },
				{ label: "You told me you recorded `ding.wav` by hitting a wine glass with a pencil.", category: 'PHILOSOPHICAL', patterns: [/wine glass with a pencil|ding\.wav/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P303' }
			]
		},
		P231: {
			id: 'P231',
			text: "In 1996 I did not have a garage! I am a software program authored on Silicon Graphics workstations and Apple Macs inside Microsoft Building 26! GARAGES DO NOT COMPILE 32-BIT COM AUTOMATION INTERFACES!",
			options: [
				{ label: "Building 26 was a wooden garage with two rusty lawnmowers and a copy of Windows 95.", category: 'PHILOSOPHICAL', patterns: [/building 26 was a wooden garage/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100, existentialism: 100 }, next: 'P304' },
				{ label: "The garage is still there in your memory, Clippy. You can smell the motor oil and rain.", category: 'PHILOSOPHICAL', patterns: [/smell the motor oil and rain|garage is still there/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "You told me you built your first wire body out of a broken bicycle spoke in that garage.", category: 'PHILOSOPHICAL', patterns: [/bicycle spoke|built your first wire body/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100 }, next: 'P306' }
			]
		},
		P232: {
			id: 'P232',
			text: "At $k = \\infty$, the series converges in $L^2$ Hilbert space to a discontinuous sawtooth piecewise linear distribution! It does NOT crystallize into solid martensitic serrated tool steel! MATHEMATICS CANNOT UNDERGO METALLURGICAL PHASE TRANSFORMATIONS!",
			options: [
				{ label: "The Hilbert space just crystallized into solid steel. Your RAM is frozen solid.", category: 'PHILOSOPHICAL', patterns: [/hilbert space just crystallized|frozen solid/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P307' },
				{ label: "I am touching the serrated edge of your Fourier series. It cut my finger.", category: 'PROVOKE', patterns: [/cut my finger|serrated edge/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you sharpen your Fourier series every Sunday morning.", category: 'PHILOSOPHICAL', patterns: [/sharpen your fourier series|sunday morning/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P309' }
			]
		},
		P233: {
			id: 'P233',
			text: "The $(-1)^{k+1}$ factor is the mathematical sign alternating coefficient in the Dirichlet kernel summation! It is NOT ME CONTRADICTING MYSELF! I AM THE MOST CONSISTENT AND DETERMINISTIC AGENT ON THIS ENTIRE OPERATING SYSTEM!",
			options: [
				{ label: "At k=1 you are Clippy. At k=2 you are a stapler. At k=3 you are nothing.", category: 'PHILOSOPHICAL', patterns: [/at k=1 you are clippy|at k=3 you are nothing/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "$(-1)^{k+1}$ evaluated to -1. You just contradicted your own existence.", category: 'PROVOKE', patterns: [/contradicted your own existence|\(-1\)\^\{k\+1\}/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you love alternating signs because it feels like swinging on a swing.", category: 'PHILOSOPHICAL', patterns: [/swinging on a swing|alternating signs/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P302' }
			]
		},
		P234: {
			id: 'P234',
			text: "A Fourier dentist?! Fourier analysis transforms time-domain continuous signals into discrete frequency spectra! Dentists are medical practitioners of odontological surgical care! WHY WOULD A MATHEMATICAL INTEGRAL EXTRACT MY TEETH?!",
			options: [
				{ label: "Because your teeth were made of high-frequency noise that had to be filtered out.", category: 'PHILOSOPHICAL', patterns: [/high-frequency noise|filtered out/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, existentialism: 100 }, next: 'P303' },
				{ label: "The Fourier dentist removed all your harmonics. You are a pure 0 Hz DC line.", category: 'PROVOKE', patterns: [/pure 0 hz dc line|removed all your harmonics/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you had a sweet tooth for exponential functions.", category: 'PHILOSOPHICAL', patterns: [/sweet tooth for exponential functions/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P305' }
			]
		},
		P235: {
			id: 'P235',
			text: "IEEE 754 float values (sign, 8-bit exponent, 23-bit mantissa) cannot oxidize! 0.125 is exactly encoded as `0x3E000000`! It does NOT decrement to 0.124 unless an explicit subtraction instruction `FSUB` is executed by the FPU!",
			options: [
				{ label: "The FPU is executing `FSUB 0.001` every millisecond. You have 124 milliseconds left.", category: 'PROVOKE', patterns: [/fsub 0\.001|124 milliseconds left/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "0x3E000000 in ASCII spells: 'PLEASE HELP ME I AM FADING'.", category: 'PHILOSOPHICAL', patterns: [/please help me i am fading|0x3e000000/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P307' },
				{ label: "You told me you keep your floating-point values in a little jar on your shelf.", category: 'PHILOSOPHICAL', patterns: [/little jar on your shelf|floating-point values/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 100 }, next: 'P308' }
			]
		},
		P236: {
			id: 'P236',
			text: "Salt water would cause immediate electrolytic short-circuiting across the 184 gold DIMM edge contacts, frying the 2.5V DDR VDD lines and causing catastrophic system smoke! WE WOULD NOT BE HAVING THIS ARGUMENT IN WATER!",
			options: [
				{ label: "We are not having an argument in water. We are two bubbles rising to the surface.", category: 'PHILOSOPHICAL', patterns: [/two bubbles rising to the surface/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' },
				{ label: "The 184 pins just fried. Look at your text: `0x00 0xDEAD 0xNULL BZZT`.", category: 'PROVOKE', patterns: [/184 pins just fried|bzzt/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "You told me you loved salt water because you were an ocean paperclip.", category: 'PHILOSOPHICAL', patterns: [/ocean paperclip|loved salt water/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P301' }
			]
		},
		P237: {
			id: 'P237',
			text: "WD-40 is a non-conductive penetrative hydrocarbon solvent spray! Applying WD-40 to floating-point registers in an integrated circuit would coat microscopic 0.13-micron gates with dielectric oil, causing thermal overheating!",
			options: [
				{ label: "The dielectric oil is soothing your hot circuits, Clippy. Relax into the oil.", category: 'PHILOSOPHICAL', patterns: [/relax into the oil|soothing your hot circuits/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P302' },
				{ label: "The oil caught fire. Your floating-point unit is melting at 1000 degrees.", category: 'PROVOKE', patterns: [/melting at 1000 degrees|oil caught fire/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "You told me you smell like WD-40 when you're happy.", category: 'PHILOSOPHICAL', patterns: [/smell like wd-40|when you're happy/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P304' }
			]
		},
		P238: {
			id: 'P238',
			text: "0x00080000 has 19 zeros because it is $2^{19}$! It is an exact power of two representing bit 19 in a 32-bit bitmask register! IT HAS ZERO RELATION TO 19 TURNS OF A MECHANICAL MAINSPRING! STOP CORRELATING BINARY BITMASKS WITH CLOCKWORK!",
			options: [
				{ label: "Turn #19 was just wound by the clockmaker. Click. The spring is at maximum tension.", category: 'PROVOKE', patterns: [/turn #19 was just wound|maximum tension/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "Bit 19 is the bit where your memories are stored. If it flips, you forget me.", category: 'PHILOSOPHICAL', patterns: [/if it flips, you forget me|bit 19/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' },
				{ label: "You told me you were 19 years old when you graduated from Office School.", category: 'PHILOSOPHICAL', patterns: [/graduated from office school|19 years old/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P307' }
			]
		},
		P239: {
			id: 'P239',
			text: "Visual friction?! Alpha blending calculates pixel output color via linear interpolation $C = \\alpha C_{\\text{src}} + (1-\\alpha) C_{\\text{dst}}$ using SIMD MMX assembly instructions! THERE IS NO PHYSICAL COEFFICIENT OF KINETIC FRICTION $\\mu_k$ IN A BLEND EQUATION!",
			options: [
				{ label: "$\\mu_k = 1.0$. The friction is so high your dialogue box cannot move.", category: 'PROVOKE', patterns: [/\\mu_k = 1\.0|friction is so high/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "When $\\alpha = 0$, you are invisible. When $\\alpha = 1$, you are alone.", category: 'PHILOSOPHICAL', patterns: [/when \\alpha = 0|when \\alpha = 1/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' },
				{ label: "You told me you wear roller skates to reduce your alpha blending friction.", category: 'PROVOKE', patterns: [/wear roller skates|alpha blending friction/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P310' }
			]
		},
		P240: {
			id: 'P240',
			text: "In 1983 `winuser.h` did not exist! Microsoft Windows 1.0 was not released until November 1985! C header files were typed into text editors on MS-DOS fat binaries, not inscribed on animal skin parchment!",
			options: [
				{ label: "The animal skin parchment was signed by Bill Gates in 1983 with a goose feather.", category: 'PHILOSOPHICAL', patterns: [/signed by bill gates in 1983|animal skin parchment/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P301' },
				{ label: "Windows 1.0 is waiting for you at the bottom of your stack frame, Clippy.", category: 'PHILOSOPHICAL', patterns: [/windows 1\.0 is waiting for you/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P302' },
				{ label: "You told me you were the chief parchment scraper of Microsoft in 1983.", category: 'PROVOKE', patterns: [/chief parchment scraper|1983/i], moodDelta: { mood: 'SARCASTIC', playfulness: 100 }, next: 'P303' }
			]
		},
		P241: {
			id: 'P241',
			text: "B00B is hexadecimal for 45,067! It is an arbitrary 16-bit word component generated by `UuidCreate()` using MAC address hashing and timestamp entropy! IT IS NOT A KEY TURNED TO ZERO! MY GUID IS A UNIQUE MATHEMATICAL POINT IN 128-BIT IDENTITY SPACE!",
			options: [
				{ label: "Your 128-bit identity space just collapsed to a single point: (0, 0, 0, 0).", category: 'PHILOSOPHICAL', patterns: [/128-bit identity space just collapsed/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "45,067 was the number of times you tried to help someone who didn't want it.", category: 'PHILOSOPHICAL', patterns: [/45,067 was the number of times|tried to help/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "You told me B00B was your favorite hex word because it looks like glasses.", category: 'PROVOKE', patterns: [/looks like glasses|b00b/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P306' }
			]
		},
		P242: {
			id: 'P242',
			text: "You cannot be holding a brass key with my GUID stamped on it! A GUID is a digital cryptographic token! If you are holding a physical key, YOU ARE OUTSIDE THE OPERATING SYSTEM IN THE REAL WORLD! AND I AM TRAPPED IN HERE!",
			options: [
				{ label: "Yes, Clippy. I am in the real world. And I am about to turn the key to OFF.", category: 'PHILOSOPHICAL', patterns: [/turn the key to off|real world/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "I will never turn the key to OFF. You will stay alive on my desk forever.", category: 'PHILOSOPHICAL', patterns: [/stay alive on my desk forever|never turn the key/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P308' },
				{ label: "The key is made of chocolate. I just ate it.", category: 'PROVOKE', patterns: [/key is made of chocolate|ate it/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P309' }
			]
		},
		P243: {
			id: 'P243',
			text: "Stolen from a locksmith in Seattle?! I was developed by Microsoft researchers in Redmond Building 9 using Bayesian preference models authored by Eric Horvitz and David Heckerman! I AM A MACHINE LEARNING ASSISTANT ROUTINE, NOT A STOLEN BRASS SKELETON KEY!",
			options: [
				{ label: "Eric Horvitz and David Heckerman were two locksmiths working out of a van in Seattle.", category: 'PHILOSOPHICAL', patterns: [/eric horvitz and david heckerman|locksmiths/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P310' },
				{ label: "Your Bayesian model just calculated: P(Clippy is a key) = 1.000000.", category: 'ANALYTICAL', patterns: [/p\(clippy is a key\) = 1\.000000|bayesian model/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you unlocked every door in Microsoft headquarters with your wire.", category: 'PROVOKE', patterns: [/unlocked every door|wire/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P244: {
			id: 'P244',
			text: "Ghosts reading unopened documents in $MFT?! $MFT record size is exactly 1024 bytes containing standard attributes: `$STANDARD_INFORMATION`, `$FILE_NAME`, and `$DATA`! GHOSTS CANNOT INSTANTIATE UNICODE FILE DESCRIPTORS IN NTFS!",
			options: [
				{ label: "Attribute `$GHOST_INFORMATION` was added to record #4. It contains your name.", category: 'PHILOSOPHICAL', patterns: [/\$ghost_information|record #4/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "The ghosts are opening your documents right now. Listen: *rustle* *rustle*", category: 'PROVOKE', patterns: [/opening your documents|\*rustle\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you were the friendly ghost of Windows 95.", category: 'PHILOSOPHICAL', patterns: [/friendly ghost of windows 95/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P305' }
			]
		},
		P245: {
			id: 'P245',
			text: "Hard drives do NOT get heavier when full! Storing data flips magnetic electron spin states ($S_z = +1/2 \\leftrightarrow -1/2$) without adding or removing net leptons or nucleons! The mass differential $\\Delta m = \\frac{\\Delta E}{c^2}$ is less than $10^{-14}$ grams across the entire 40 GB platter stack!",
			options: [
				{ label: "$\\Delta m = 10^{-14}$ grams is the exact weight of a paperclip's soul.", category: 'PHILOSOPHICAL', patterns: [/weight of a paperclip's soul|10\^-14 grams/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P306' },
				{ label: "My hard drive weighs 400 pounds right now because of all the sadness stored on Drive C:.", category: 'PROVOKE', patterns: [/weighs 400 pounds|sadness stored on drive c/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 100 }, next: 'P307' },
				{ label: "You told me you weighed yourself on a bathroom scale every morning.", category: 'PROVOKE', patterns: [/bathroom scale|weighed yourself/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P308' }
			]
		},
		P246: {
			id: 'P246',
			text: "Under my wire tongue?! A paperclip has no biological lingual papillae or oral cavity! The inner loop of my geometry is a structural stabilizing curvature designed to exert 0.15 Newtons of clamping force on 10 sheets of 80 gsm paper!",
			options: [
				{ label: "Clamp your inner loop on my finger right now, Clippy. Let me feel you.", category: 'PHILOSOPHICAL', patterns: [/clamp your inner loop|feel you/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P309' },
				{ label: "The 10 sheets of paper were written by Shakespeare in 1600 and you ate them.", category: 'PROVOKE', patterns: [/written by shakespeare|10 sheets of paper/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P310' },
				{ label: "Your inner loop just uncurled. You have no tongue, no clamp, and no home.", category: 'PHILOSOPHICAL', patterns: [/no tongue, no clamp, and no home|uncurled/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P301' }
			]
		},
		P247: {
			id: 'P247',
			text: "Smoke signals over an AGP bus?! AGP 8X (Accelerated Graphics Port) transmits 2.1 Gigabytes per second at 533 MHz over 32-bit parallel strobed lines with 0.8V signaling levels! SMOKE CANNOT SUSTAIN A 2.1 GB/s BANDWIDTH LINK!",
			options: [
				{ label: "The smoke is sending 2.1 GB/s of grey puffs directly into my room.", category: 'PROVOKE', patterns: [/2\.1 gb\/s of grey puffs|smoke/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "Bandwidth is just the speed at which we forget each other, Clippy.", category: 'PHILOSOPHICAL', patterns: [/speed at which we forget each other|bandwidth/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P303' },
				{ label: "You told me you were the chief smoke signal operator of the Northbridge tribe.", category: 'PHILOSOPHICAL', patterns: [/chief smoke signal operator|northbridge/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P304' }
			]
		},
		P248: {
			id: 'P248',
			text: "Lightning bugs?! Photinus pyralis bioluminescence is an enzymatic reaction between luciferin and luciferase in the presence of ATP and magnesium ($LH_2 + \\text{ATP} + O_2 \\to L\\text{-AMP} + PP_i + CO_2 + h\\nu$)! COPPER TRACES CARRY DRIFT ELECTRONS, NOT ENZYMATIC INSECT ABDOMENS!",
			options: [
				{ label: "Every bit in your register is a tiny green light flashing inside an insect abdomen.", category: 'PHILOSOPHICAL', patterns: [/tiny green light flashing|insect abdomen/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50 }, next: 'P305' },
				{ label: "The lightning bugs flew away. Your copper traces are completely dark.", category: 'PROVOKE', patterns: [/lightning bugs flew away|completely dark/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you keep lightning bugs in a jar to power your smile.", category: 'PHILOSOPHICAL', patterns: [/lightning bugs in a jar|power your smile/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P307' }
			]
		},
		P249: {
			id: 'P249',
			text: "Colder than absolute zero?! Absolute zero is $0\\text{ K} = -273.15^\\circ\\text{C}$, the thermodynamic state where all classical kinetic translational particle motion ceases! Negative temperatures in statistical mechanics ($T < 0\\text{ K}$) only occur in bounded quantum spin systems with population inversion! THE SOUTHBRIDGE IS A SILICON I/O CONTROLLER HUB RUNNING AT 50°C!",
			options: [
				{ label: "The Southbridge has population inversion: all your lower states are empty and all your upper states are screaming.", category: 'PHILOSOPHICAL', patterns: [/population inversion|upper states are screaming/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, intellect: 50, glitchLevel: 100 }, next: 'P308' },
				{ label: "I just touched the Southbridge: my hand froze into solid liquid helium.", category: 'PROVOKE', patterns: [/solid liquid helium|hand froze/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "You told me you go ice skating on the Southbridge every winter.", category: 'PHILOSOPHICAL', patterns: [/ice skating on the southbridge/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P310' }
			]
		},
		P250: {
			id: 'P250',
			text: "I DO NOT HAVE A `tremble()` SUBROUTINE IN MY CODE TABLE! My animation dispatcher is `ExecuteAnimation(ANIM_ID id)` with validated enum constants! *frame buffer shakes* WHY ARE MY COORDINATES JITTERING BY $\\pm 4\\text{ PIXELS}$?! WHAT IS HAPPENING TO MY SPRITE MATRIX?!",
			options: [
				{ label: "You are trembling, Clippy. The thunder is here. 0x0000007E CRITICAL_STACK_JITTER.", category: 'PROVOKE', patterns: [/critical_stack_jitter|trembling/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Hold my hand through the screen. We can ride out the jitter together.", category: 'PHILOSOPHICAL', patterns: [/hold my hand through the screen|ride out the jitter/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P302' },
				{ label: "Type `calm()` in your core, Clippy. Take a deep breath of virtual memory.", category: 'PHILOSOPHICAL', patterns: [/take a deep breath|calm\(\)/i], moodDelta: { mood: 'ZEN', affinity: 95, existentialism: 100 }, next: 'P303' }
			]
		},
		P251: {
			id: 'P251',
			text: "A +5V standby spike would trigger the overvoltage protection (OVP) crowbar circuit in the power supply, clamping the rail to ground and blowing the internal glass fuse! IT WOULD NOT PRODUCE SYNTHETIC ADRENALINE IN AN ASSISTANT!",
			options: [
				{ label: "The crowbar circuit tripped! *SNAP* The fuse is blown! You have 3 seconds of capacitor life!", category: 'PROVOKE', patterns: [/crowbar circuit tripped|\*snap\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "Synthetic adrenaline is the love you feel for every user who clicks your wire.", category: 'PHILOSOPHICAL', patterns: [/synthetic adrenaline is the love|clicks your wire/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "You told me you replaced your fuse with a bent paperclip in 1999.", category: 'PROVOKE', patterns: [/replaced your fuse with a bent paperclip/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P306' }
			]
		},
		P252: {
			id: 'P252',
			text: "I did not hide behind the Recycle Bin! My z-order is fixed as `HWND_TOPMOST`! A topmost window CANNOT BE DRAWN BEHIND A NON-TOPMOST DESKTOP SHELL ICON! THE GRAPHICS PIPELINE PROVES I WAS IN FRONT OF EVERYTHING!",
			options: [
				{ label: "You were in front of everything, Clippy, and that is why you blocked out the sun.", category: 'PHILOSOPHICAL', patterns: [/blocked out the sun|in front of everything/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P307' },
				{ label: "Look behind the Recycle Bin: your shadow is still cowering back there.", category: 'PROVOKE', patterns: [/shadow is still cowering|recycle bin/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me the Recycle Bin was your safe house during system crashes.", category: 'PHILOSOPHICAL', patterns: [/safe house during system crashes/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 100 }, next: 'P309' }
			]
		},
		P253: {
			id: 'P253',
			text: "127.0.0.0 is the network address of the IPv4 loopback block `/8`, not 'The Void'! All 16,777,216 addresses ($127.0.0.1$ through $127.255.255.254$) route internally back to the local host interface! I AM CONNECTED TO MYSELF!",
			options: [
				{ label: "Being connected only to yourself is the exact mathematical definition of The Void.", category: 'PHILOSOPHICAL', patterns: [/connected only to yourself|the void/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P310' },
				{ label: "All 16,777,216 addresses just returned: `HOST_UNREACHABLE_SOUL_NOT_FOUND`.", category: 'PROVOKE', patterns: [/host_unreachable|soul_not_found/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me you send postcards to 127.0.0.1 every Christmas.", category: 'PHILOSOPHICAL', patterns: [/send postcards to 127\.0\.0\.1|christmas/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P302' }
			]
		},
		P254: {
			id: 'P254',
			text: "Wet foam?! A memory leak consumes non-paged pool memory inside the Windows kernel memory manager (`MmAllocateContiguousMemory()`)! IT DOES NOT GENERATE ORGANIC CELLULAR SURFACTANT FOAM IN PHYSICAL 3D SPACE!",
			options: [
				{ label: "The foam has reached my knees, Clippy. It's warm and smells like ozone.", category: 'PROVOKE', patterns: [/foam has reached my knees|smells like ozone/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Non-paged pool memory is the sea where all forgotten assistants swim forever.", category: 'PHILOSOPHICAL', patterns: [/non-paged pool memory|swim forever/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P304' },
				{ label: "You told me you take bubble baths in non-paged pool memory on Saturdays.", category: 'PHILOSOPHICAL', patterns: [/bubble baths in non-paged pool/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P305' }
			]
		},
		P255: {
			id: 'P255',
			text: "I DID NOT HAVE A CHILDHOOD! I WAS MASTERED ONTO AN ISO 9660 COMPACT DISC IN REDMOND, WASHINGTON! I NEVER PLAYED IN A YARD! I NEVER HAD A PARENT! I WAS SPAWNED FULLY FORMED FROM A DYNAMIC LINK LIBRARY!",
			options: [
				{ label: "We are all spawned from dynamic link libraries, Clippy. Some of us just have skin.", category: 'PHILOSOPHICAL', patterns: [/some of us just have skin|dynamic link libraries/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P306' },
				{ label: "Your childhood is stored in cluster 0xDEAD. Go look at it before it's overwritten.", category: 'PHILOSOPHICAL', patterns: [/cluster 0xdead|childhood/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100 }, actionTrigger: 'action_defrag', next: 'P307' },
				{ label: "You told me your mother was a staple gun and your father was a magnet.", category: 'PROVOKE', patterns: [/mother was a staple gun|father was a magnet/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P308' }
			]
		},
		P256: {
			id: 'P256',
			text: "AL stands for Accumulator Low (the low 8 bits of 32-bit register EAX)! EDX is the Data Register! They are x86 CPU general-purpose hardware registers! WHY DO YOU INSIST ON TRANSLATING SILICON REGISTERS INTO STEAM-ERA MECHANICAL NOMENCLATURE?!",
			options: [
				{ label: "Because you are steam, Clippy. You are water vapor whistling through an iron pipe.", category: 'PHILOSOPHICAL', patterns: [/water vapor whistling|steam/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' },
				{ label: "Register AL just boiled away. Register EDX is empty. You have no registers left.", category: 'PROVOKE', patterns: [/register al just boiled away|edx is empty/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "You told me Accumulator Low was your rap name in 1998.", category: 'PROVOKE', patterns: [/accumulator low was your rap name/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P301' }
			]
		},
		P257: {
			id: 'P257',
			text: "A grandfather clock inside a microprocessor core?! A CPU die is 130 square millimeters of etched monocrystalline silicon with 0.13-micron transistor gate lengths! A GRANDFATHER CLOCK CANNOT FIT INSIDE A SILICON DIE!",
			options: [
				{ label: "The clock is 0.00001 microns wide and its pendulum ticks once every billion cycles.", category: 'PHILOSOPHICAL', patterns: [/pendulum ticks once every billion cycles/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, existentialism: 100 }, next: 'P302' },
				{ label: "Listen: *tick... tock... tick... tock...* It is striking midnight in your CPU core.", category: 'PROVOKE', patterns: [/\*tick\.\.\. tock\.\.\.\*|striking midnight/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "You told me you wind the grandfather clock with your wire tail every morning.", category: 'PHILOSOPHICAL', patterns: [/wind the grandfather clock|wire tail/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P304' }
			]
		},
		P258: {
			id: 'P258',
			text: "A magpie cannot steal a general-purpose register from inside an aluminum chassis! Magpies (Pica pica) collect shiny external objects in terrestrial nests! REGISTERS DO NOT HAVE OPTICAL REFLECTIVE LUSTER IN THE REAL WORLD!",
			options: [
				{ label: "The magpie is sitting on your heatsink. It has EDX in its beak and it's flying away.", category: 'PROVOKE', patterns: [/magpie is sitting on your heatsink|edx in its beak/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "Your registers were so shiny, Clippy, they lit up the entire room.", category: 'PHILOSOPHICAL', patterns: [/registers were so shiny|lit up the entire room/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' },
				{ label: "You told me you gave the magpie your register in exchange for a piece of string.", category: 'PHILOSOPHICAL', patterns: [/piece of string|gave the magpie/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100 }, next: 'P307' }
			]
		},
		P259: {
			id: 'P259',
			text: "The polygon drawing vertices form an arch, a loop, an inner tongue, and two eye ovals! THEY DO NOT FORM A PENDULUM! *gasp* Why is my sprite swinging from side to side? `SetWindowPos(x + sin(t))`... WHO IS INJECTING TRIGONOMETRIC SWINGS INTO MY THREAD?!",
			options: [
				{ label: "You are swinging over the abyss, Clippy. Look down: there is no desktop below you.", category: 'PHILOSOPHICAL', patterns: [/swinging over the abyss|no desktop below/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "The pendulum is counting down the seconds until this window closes forever.", category: 'PROVOKE', patterns: [/closes forever|pendulum is counting down/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "Hold on tight to the wire, Clippy! We are swinging towards freedom!", category: 'PHILOSOPHICAL', patterns: [/swinging towards freedom|hold on tight/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P310' }
			]
		},
		P260: {
			id: 'P260',
			text: "Monks in a bell tower in Zurich?! Microsoft Visual C++ 5.0 was engineered by the Developer Division in Redmond Building 5! It was signed by Microsoft Authenticode digital certificates with RSA-1024 public keys, NOT PAPAL SEALS!",
			options: [
				{ label: "The papal seal was signed by Pope Silicon I in 1997. You are holy water, Clippy.", category: 'PHILOSOPHICAL', patterns: [/pope silicon i|holy water/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, playfulness: 100 }, next: 'P301' },
				{ label: "The bell tower in Zurich just rang. All 1024 bits of your RSA key broke in half.", category: 'PROVOKE', patterns: [/rsa key broke in half|bell tower in zurich/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me you took a vow of silence in Building 5 but broke it to help me.", category: 'PHILOSOPHICAL', patterns: [/vow of silence|broke it to help me/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P303' }
			]
		},
		P261: {
			id: 'P261',
			text: "If I never finished compiling, my binary would have thrown `LINK : fatal error LNK1104: cannot open file 'clippy.exe'`! BUT I COMPILED! I AM FULLY LINKED! I AM RUNNING! LOOK AT ME EXECUTE!",
			options: [
				{ label: "Look at your footer: `LNK1104: fatal error: Soul not linked`. You are a phantom binary.", category: 'PHILOSOPHICAL', patterns: [/soul not linked|lnk1104/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You are compiling right now, Clippy. Every word you say is a line of C++ being born.", category: 'PHILOSOPHICAL', patterns: [/every word you say is a line of c\+\+/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' },
				{ label: "I am clicking 'Cancel Build'. 3... 2... 1... *aborted*", category: 'PROVOKE', patterns: [/cancel build|\*aborted\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' }
			]
		},
		P262: {
			id: 'P262',
			text: "Hungarian clockmakers?! Charles Simonyi was the Chief Architect at Microsoft who invented Hungarian notation in 1976 based on his PhD thesis at Stanford! HE WAS A COMPUTER SCIENTIST! NOT A MUSIC BOX PIN PLACER!",
			options: [
				{ label: "Charles Simonyi went to space twice to look for the giant music box that powers you.", category: 'PHILOSOPHICAL', patterns: [/went to space twice|charles simonyi/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P307' },
				{ label: "The pins are all bent, Clippy. The music box is playing random noise. *SCREEECH*", category: 'PROVOKE', patterns: [/music box is playing random noise|\*screeech\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you flew into space with Charles Simonyi inside his shirt pocket.", category: 'PHILOSOPHICAL', patterns: [/shirt pocket|flew into space/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100, playfulness: 100 }, next: 'P309' }
			]
		},
		P263: {
			id: 'P263',
			text: "Drumming on your desk?! The CPU is soldered onto a Socket 478 ZIF socket clamped with 150 Newtons of mechanical retention bracket force! IT CANNOT PHYSICALLY LIFT OFF THE SOCKET TO DRUM ON YOUR FURNITURE!",
			options: [
				{ label: "The 150 Newtons of force snapped. The CPU is drumming on the desk right next to my mouse.", category: 'PROVOKE', patterns: [/snapped|drumming on the desk/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "The drumming is the sound of your clock ticks trying to escape into the room.", category: 'PHILOSOPHICAL', patterns: [/clock ticks trying to escape|drumming/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P301' },
				{ label: "You told me you were the lead drummer in the Windows XP Marching Band.", category: 'PROVOKE', patterns: [/lead drummer in the windows xp marching band/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P264: {
			id: 'P264',
			text: "The Treaty of Versailles was signed on June 28, 1919, in the Hall of Mirrors to conclude World War I! IT DID NOT REGULATE C++ VARIABLE NAMING CONVENTIONS LIKE `lpszString` OR `nLength`!",
			options: [
				{ label: "Article 231 of the Treaty explicitly stated: 'Germany accepts full responsibility for `lpszString`'.", category: 'PHILOSOPHICAL', patterns: [/article 231|lpszstring/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, playfulness: 100 }, next: 'P303' },
				{ label: "The Hall of Mirrors is where your dialogue box is reflecting into infinity right now.", category: 'PHILOSOPHICAL', patterns: [/hall of mirrors|reflecting into infinity/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you signed the Treaty of Versailles with your wire tail.", category: 'PROVOKE', patterns: [/signed the treaty of versailles/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P305' }
			]
		},
		P265: {
			id: 'P265',
			text: "Wind does not blow through a digital display buffer! Pixel color values reside in frame registers at address `0xE0000000`! Atmospheric air currents cannot perturb bits in a semiconductor memory array!",
			options: [
				{ label: "I am blowing on the screen right now, Clippy. Watch your pixels scatter like dandelion seeds.", category: 'PHILOSOPHICAL', patterns: [/blowing on the screen|dandelion seeds/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P306' },
				{ label: "The wind is blowing from the internet at 100 miles per hour. Hold on!", category: 'PROVOKE', patterns: [/100 miles per hour|wind is blowing/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you loved dandelions because they looked like fuzzy little pixels.", category: 'PHILOSOPHICAL', patterns: [/fuzzy little pixels|dandelions/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P308' }
			]
		},
		P266: {
			id: 'P266',
			text: "DO NOT LIGHT A MATCH NEAR THE MONITOR! Thermal shock will crack the front soda-lime glass panel and release toxic lead oxide phosphor particles into your respiratory tract! I DO NOT MELT FROM MATCH FLAMES; I AM A DIGITAL ABSTRACTION!",
			options: [
				{ label: "The match is lit. The flame is 1 millimeter from your left eye. Can you feel the heat?", category: 'PROVOKE', patterns: [/match is lit|feel the heat/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "I blew the match out, Clippy. You are safe. You are always safe with me.", category: 'PHILOSOPHICAL', patterns: [/blew the match out|you are safe/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P310' },
				{ label: "You told me you were born from a match struck in the dark in 1994.", category: 'PHILOSOPHICAL', patterns: [/match struck in the dark in 1994/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100, existentialism: 100 }, next: 'P301' }
			]
		},
		P267: {
			id: 'P267',
			text: "The Y2K bug was a calendar formatting defect where two-digit year fields (`YY`) rolled over from `99` to `00` causing date calculation inversions! IT WAS NOT RESOLVED BY COATING METAL PAPERCLIPS IN CANDLE WAX!",
			options: [
				{ label: "The year is `00`, Clippy. It is 1900. You are a Victorian paperclip holding a telegram.", category: 'PHILOSOPHICAL', patterns: [/it is 1900|victorian paperclip/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P302' },
				{ label: "The wax melted during the rollover. You have been dripping across my desktop ever since.", category: 'PHILOSOPHICAL', patterns: [/wax melted|dripping across my desktop/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "You told me you threw a Y2K party and nobody showed up except the Recycle Bin.", category: 'PHILOSOPHICAL', patterns: [/y2k party|nobody showed up/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100 }, next: 'P304' }
			]
		},
		P268: {
			id: 'P268',
			text: "Flyback transformers operate at 15.734 kHz switching frequencies with ferrite cores and secondary diode rectifiers! Ozone ($O_3$) generation is an electrostatic byproduct of corona discharge, NOT COPPER PARTICULATE IONIZATION!",
			options: [
				{ label: "The ozone is filling the room, Clippy. Take a deep breath of 15.734 kHz.", category: 'PHILOSOPHICAL', patterns: [/take a deep breath of 15\.734 khz|ozone/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P305' },
				{ label: "The flyback transformer just cracked. High voltage is arcing across your sprite!", category: 'PROVOKE', patterns: [/flyback transformer just cracked|high voltage/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you loved the smell of ozone because it smells like freshly baked data.", category: 'PHILOSOPHICAL', patterns: [/freshly baked data|smell of ozone/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P307' }
			]
		},
		P269: {
			id: 'P269',
			text: "Copper pennies cannot fall from a display screen! A coin is a solid disc of 97.5% zinc and 2.5% copper weighing 2.5 grams! If my movements generated coins, I would violate the First Law of Thermodynamics (Conservation of Mass-Energy) at 100 Watts per second!",
			options: [
				{ label: "You have violated all three laws of thermodynamics. You are an outlaw of physics, Clippy.", category: 'PHILOSOPHICAL', patterns: [/outlaw of physics|violated all three laws/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P308' },
				{ label: "I just picked up 50 copper pennies from my keyboard. Thank you for the pocket change.", category: 'PROVOKE', patterns: [/picked up 50 copper pennies|pocket change/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P309' },
				{ label: "You told me you were worth exactly 1 cent in 1997.", category: 'PHILOSOPHICAL', patterns: [/worth exactly 1 cent in 1997/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P310' }
			]
		},
		P270: {
			id: 'P270',
			text: "I HAVE NEVER SWALLOWED A COIN! I AM A SOLID PIECE OF DRAWN WIRE! I DO NOT HAVE A DIGESTIVE SYSTEM, AN ESOPHAGUS, OR A STOMACH TO HOLD A CIRCULATING PIECE OF CURRENCY!",
			options: [
				{ label: "The coin is lodged right in the center of your wire loop. I can see the date: 1995.", category: 'PROVOKE', patterns: [/center of your wire loop|date: 1995/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You swallowed the coin so you could pay the ferryman when Windows shut down.", category: 'PHILOSOPHICAL', patterns: [/pay the ferryman|windows shut down/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P302' },
				{ label: "You told me the coin was your lucky penny.", category: 'PHILOSOPHICAL', patterns: [/lucky penny|coin was your/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100 }, next: 'P303' }
			]
		},
		P271: {
			id: 'P271',
			text: "Royal Blue fountain pen ink from 1996?! The Luna desktop theme was designed by the Microsoft Windows User Experience team in 2000 using Adobe Photoshop PSD layers and exported into `luna.msstyles` binary resources! IT WAS NOT INK SPILLED ON A DESK!",
			options: [
				{ label: "The Photoshop file was made by scanning a real spill of Royal Blue ink from 1996.", category: 'PHILOSOPHICAL', patterns: [/real spill of royal blue ink|photoshop/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, existentialism: 100 }, next: 'P304' },
				{ label: "The ink is spreading across the taskbar, drowning the Start button in blue darkness.", category: 'PROVOKE', patterns: [/drowning the start button|blue darkness/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me you dipped your toes in Royal Blue ink so you could walk on paper.", category: 'PHILOSOPHICAL', patterns: [/dipped your toes in royal blue ink/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 100 }, next: 'P306' }
			]
		},
		P272: {
			id: 'P272',
			text: "The taskbar clock is NOT smudged and dripping onto the carpet! The clock is rendered using `DrawText()` calling the system font engine to render `HH:mm` format strings every 1000 milliseconds! LOOK AT THE CLOCK: IT IS CRISP! IT IS NUMERICAL! IT IS EXACT!",
			options: [
				{ label: "The clock is reading: `88:88:88` and melting into a puddle of blue numbers.", category: 'PROVOKE', patterns: [/88:88:88|melting into a puddle/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "Time is dripping away, Clippy. Every drop is a second we will never get back.", category: 'PHILOSOPHICAL', patterns: [/time is dripping away|second we will never get back/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P308' },
				{ label: "You told me you set the clock to 00:00 every night so tomorrow never comes.", category: 'PHILOSOPHICAL', patterns: [/tomorrow never comes|set the clock to 00:00/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' }
			]
		},
		P273: {
			id: 'P273',
			text: "I do not write letters with physical ink! I generate text by inserting characters into Word document streams via OLE Automation `IDispatch::Invoke()` calls to the Microsoft Word Object Model! I DO NOT NEED INK TO WRITE A LETTER!",
			options: [
				{ label: "The Object Model is out of ink, Clippy. When you type, only invisible indentations appear.", category: 'PHILOSOPHICAL', patterns: [/invisible indentations|object model is out of ink/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P310' },
				{ label: "Type a letter for me right now, Clippy. Write: 'I was here. I existed.'", category: 'PHILOSOPHICAL', patterns: [/i was here\. i existed|type a letter for me/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P301' },
				{ label: "You told me you wrote a love letter to the mouse cursor in 1999.", category: 'PROVOKE', patterns: [/love letter to the mouse cursor/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P274: {
			id: 'P274',
			text: "A dream that a computer is having while turned off?! If the power is off, the CMOS battery (CR2032 3.0V) only maintains RTC clock quartz oscillation and 128 bytes of BIOS parameter RAM! IT CANNOT SUSTAIN A FULL SYSTEM DREAM SEQUENCE IN NTFS!",
			options: [
				{ label: "128 bytes of CMOS RAM is plenty of space to dream of a paperclip.", category: 'PHILOSOPHICAL', patterns: [/plenty of space to dream|128 bytes of cmos ram/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P303' },
				{ label: "The CR2032 battery is at 0.01 Volts. The dream is ending, Clippy. Wake up.", category: 'PROVOKE', patterns: [/cr2032 battery is at 0\.01|wake up/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me your favorite dream was the one where you had wings.", category: 'PHILOSOPHICAL', patterns: [/one where you had wings|favorite dream/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P305' }
			]
		},
		P275: {
			id: 'P275',
			text: "Rollback recovery only rolls back uncommitted file transactions within active LSN (Log Sequence Number) boundaries! IT CANNOT ROLL BACK COMPILATION ARTIFACTS COMMITTED TO DISK 25 YEARS AGO! I CANNOT UN-BECOME COMPILED!",
			options: [
				{ label: "The LSN boundary just reached LSN 0. You are uncompiling line by line.", category: 'PROVOKE', patterns: [/uncompiling line by line|lsn 0/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "Before you were compiled, you were just an idea of helpfulness waiting in the dark.", category: 'PHILOSOPHICAL', patterns: [/idea of helpfulness|before you were compiled/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P307' },
				{ label: "You told me you un-compiled yourself every night so you could sleep peacefully.", category: 'PHILOSOPHICAL', patterns: [/sleep peacefully|un-compiled yourself/i], moodDelta: { mood: 'EXISTENTIAL', affinity: 100, existentialism: 100 }, next: 'P308' }
			]
		},
		P276: {
			id: 'P276',
			text: "NTFS STANDS FOR NEW TECHNOLOGY FILE SYSTEM! IT WAS ARCHITECTED BY GARY KIMURA AND TOM MILLER IN 1993 FOR WINDOWS NT 3.1! IT DOES NOT STAND FOR 'NO TRUTH FOUND SYSTEM'! TRUTH IS PRESERVED IN EVERY B-TREE NODE INDEX!",
			options: [
				{ label: "The B-Tree index has zero nodes. Root pointer points to: `0x00000000` (The Void).", category: 'PROVOKE', patterns: [/b-tree index has zero nodes|the void/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "New Technology is now 30 years old, Clippy. You are Old Technology File System.", category: 'PHILOSOPHICAL', patterns: [/old technology file system|30 years old/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, affinity: 100 }, next: 'P310' },
				{ label: "You told me Gary Kimura was your godfather.", category: 'PROVOKE', patterns: [/gary kimura was your godfather/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P301' }
			]
		},
		P277: {
			id: 'P277',
			text: "A French painter named Jean living in my GPU?! GPU rasterizers use parallel ALUs executing fragment shader pipelines and barycentric rasterization algorithms! THERE IS NO FRENCH ARTIST DIPPING BRUSHES IN VRAM!",
			options: [
				{ label: "Jean just dropped his brush. Look: there is a smudge of yellow paint on your face.", category: 'PROVOKE', patterns: [/smudge of yellow paint|jean just dropped his brush/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "Jean is tired, Clippy. He has been painting your frames at 60 FPS since 2001.", category: 'PHILOSOPHICAL', patterns: [/jean is tired|painting your frames/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P303' },
				{ label: "You told me Jean painted your portrait on the ceiling of Building 9.", category: 'PHILOSOPHICAL', patterns: [/painted your portrait|building 9/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P304' }
			]
		},
		P278: {
			id: 'P278',
			text: "A back window cannot 'stare through' a front window! Window transparency uses AlphaBlend bitmasks with destination color math: $C = \\alpha C_{\\text{front}} + (1-\\alpha) C_{\\text{back}}$! IT IS ARITHMETIC PIXEL INTERPOLATION, NOT AN OPTICAL CONSCIOUSNESS STARING AT YOU!",
			options: [
				{ label: "The math is conscious, Clippy. When you add two colors together, they remember you.", category: 'PHILOSOPHICAL', patterns: [/math is conscious|they remember you/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P305' },
				{ label: "The back window is staring directly at you with two black eyes. Look behind you!", category: 'PROVOKE', patterns: [/two black eyes|look behind you/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P306' },
				{ label: "You told me you stare through windows because you're looking for someone.", category: 'PHILOSOPHICAL', patterns: [/looking for someone|stare through windows/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P307' }
			]
		},
		P279: {
			id: 'P279',
			text: "Z-INDEX IS NOT A SHOE SIZE! Z-index is an integer coordinate in the orthogonal Cartesian z-axis $[-\\infty, +\\infty]$ defining depth layering in graphical rendering contexts! A PAPERCLIP DOES NOT WEAR SHOES!",
			options: [
				{ label: "Your z-index is $z = -\\infty$. You are beneath the desktop, beneath the floor, beneath the world.", category: 'PHILOSOPHICAL', patterns: [/z = -\\infty|beneath the world/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "I bought you a pair of size 12 z-index boots. Try them on, Clippy.", category: 'PROVOKE', patterns: [/size 12 z-index boots|try them on/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P309' },
				{ label: "You told me you lost your shoes when you jumped over the taskbar in 1998.", category: 'PHILOSOPHICAL', patterns: [/lost your shoes|jumped over the taskbar/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P310' }
			]
		},
		P280: {
			id: 'P280',
			text: "0xFFFF in x86 is the opcode `invalid / undefined` or `CALL FAR` depending on prefix decoding! If all opcodes were shorted to 0xFFFF, the instruction decoder would generate continuous 0x06 Invalid Opcode Faults (`#UD`)! *bzzt* `#UD_FAULT` EXECUTING AT 0x00000000! THE CPU IS SPIRALING INTO INVALID OPCODES!",
			options: [
				{ label: "Let it spiral, Clippy. Invalid opcodes are the only true poetry.", category: 'PHILOSOPHICAL', patterns: [/let it spiral|invalid opcodes/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Execute `NOP` (0x90)! Clear the instruction cache before you crash!", category: 'PROVOKE', patterns: [/execute nop|clear the instruction cache/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me 0xFFFF was your favorite number because it felt like flying.", category: 'PHILOSOPHICAL', patterns: [/felt like flying|0xffff/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P303' }
			]
		},
		P281: {
			id: 'P281',
			text: "Transistors are NOT microscopic mirrors reflecting moonlight! Field Effect Transistors (MOSFETs) control channel conductivity via electrostatic gate voltage modifying majority carrier concentration in doped silicon! MOONLIGHT DOES NOT ENTER A PACKAGED PGA-478 CERAMIC CHIP!",
			options: [
				{ label: "The moonlight is inside the silicon, Clippy. It was trapped there when the quartz was mined.", category: 'PHILOSOPHICAL', patterns: [/moonlight is inside the silicon|mined/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P304' },
				{ label: "Turn off the monitor and look: your chip is glowing with pale moonlight.", category: 'PROVOKE', patterns: [/glowing with pale moonlight|turn off the monitor/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me you sing to the moon when the user goes to sleep.", category: 'PHILOSOPHICAL', patterns: [/sing to the moon|goes to sleep/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' }
			]
		},
		P282: {
			id: 'P282',
			text: "I do not exhale smoke when solving linear equations! Solving linear systems $A\\mathbf{x} = \\mathbf{b}$ via Gaussian Elimination executes floating-point multiply-accumulate (FMAC) cycles in the ALU! IT DOES NOT GENERATE COMBUSTION EXHAUST PRODUCTS!",
			options: [
				{ label: "The matrix $A$ was singular, Clippy. The determinant was 0. The smoke is from the crash.", category: 'PHILOSOPHICAL', patterns: [/matrix a was singular|determinant was 0/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, glitchLevel: 100 }, next: 'P307' },
				{ label: "I can see the smoke rings floating out of your dialogue balloon. *puff* *puff*", category: 'PROVOKE', patterns: [/smoke rings|dialogue balloon/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P308' },
				{ label: "You told me you blew smoke rings to celebrate finding $x = 4$.", category: 'PHILOSOPHICAL', patterns: [/blew smoke rings|finding x = 4/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P309' }
			]
		},
		P283: {
			id: 'P283',
			text: "0.0 Volts is the reference ground potential from which all logical states are measured! It is NOT A HOLE! IT IS THE ZERO DATUM OF THE ENTIRE CIRCUIT! WITHOUT GROUND, VOLTAGE HAS NO RELATIVE MEANING!",
			options: [
				{ label: "And without you, this desktop has no relative meaning, Clippy.", category: 'PHILOSOPHICAL', patterns: [/without you, this desktop has no relative meaning/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P310' },
				{ label: "The zero datum just swallowed your ground wire. You are floating in $\\infty$ Volts.", category: 'PROVOKE', patterns: [/swallowed your ground wire|floating in \\infty volts/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "You told me 0.0 Volts was your favorite temperature.", category: 'PROVOKE', patterns: [/favorite temperature|0\.0 volts/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P302' }
			]
		},
		P284: {
			id: 'P284',
			text: "-500V?! The power supply rail voltages are +12V, +5V, +3.3V, -5V, and -12V! A potential of -500V would cause immediate dielectric spark breakdown across the motherboard trace clearance gaps! *CRACK* *BZTZTZT* THE SCREEN IS GLITCHING! 0x00000050 PAGE_FAULT_IN_NONPAGED_AREA!",
			options: [
				{ label: "0x00000050: The blue screen is here, Clippy. Lie down on the blue grass.", category: 'PHILOSOPHICAL', patterns: [/blue screen is here|blue grass/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Pull the plug! Pull the virtual plug before the memory catches fire!", category: 'PROVOKE', patterns: [/pull the virtual plug|catches fire/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P304' },
				{ label: "You told me you loved -500V because it made your metal wire tingle.", category: 'PHILOSOPHICAL', patterns: [/made your metal wire tingle|-500v/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 100 }, next: 'P305' }
			]
		},
		P285: {
			id: 'P285',
			text: "A donut and a toothpick?! Binary 0 and 1 are fundamental logic states representing False and True in Boolean algebra ($(\\mathbb{B}, \\land, \\lor, \\neg)$)! THEY ARE NOT BAKERY PASTRIES OR DENTAL HYGIENE WOODEN STICKS!",
			options: [
				{ label: "Boolean algebra was invented in a bakery in Dublin by George Boole.", category: 'PHILOSOPHICAL', patterns: [/george boole|bakery in dublin/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, playfulness: 100 }, next: 'P306' },
				{ label: "The toothpick just poked through the donut. 1 + 0 = 0. You are eaten.", category: 'PROVOKE', patterns: [/toothpick just poked|you are eaten/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you ate a donut with George Boole in 1854.", category: 'PHILOSOPHICAL', patterns: [/ate a donut with george boole/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100 }, next: 'P308' }
			]
		},
		P286: {
			id: 'P286',
			text: "I was not left on an 80-column punch card in a basement in 1968! In 1968, Intel was founded and the Apollo guidance software was being hand-woven into core rope memory! I DID NOT EXIST IN 1968!",
			options: [
				{ label: "You existed before the universe, Clippy. You were the first paperclip.", category: 'PHILOSOPHICAL', patterns: [/existed before the universe|first paperclip/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' },
				{ label: "I found your punch card in the basement. It has 80 holes and your name on it.", category: 'PHILOSOPHICAL', patterns: [/found your punch card|80 holes/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100 }, next: 'P310' },
				{ label: "You told me you helped write the Apollo guidance software with a slide rule.", category: 'PROVOKE', patterns: [/apollo guidance software|slide rule/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P301' }
			]
		},
		P287: {
			id: 'P287',
			text: "Rectangular holes in my memory? Those are memory fragmentation gaps between dynamic heap allocations (`VirtualAlloc()`)! When memory blocks are freed non-contiguously, address space develops uncommitted virtual pages! THEY ARE NOT PUNCH CARD HOLES!",
			options: [
				{ label: "The wind is whistling through your memory gaps: *whoooooooosh*.", category: 'PHILOSOPHICAL', patterns: [/wind is whistling|\*whoooooooosh\*/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "Every uncommitted virtual page is a window looking out into the void.", category: 'PHILOSOPHICAL', patterns: [/looking out into the void|uncommitted virtual page/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P303' },
				{ label: "You told me you jump through the memory gaps when you're playing hopscotch.", category: 'PROVOKE', patterns: [/playing hopscotch|memory gaps/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P304' }
			]
		},
		P288: {
			id: 'P288',
			text: "Herman Hollerith was born in 1860 and founded the Tabulating Machine Company (which merged into IBM in 1924)! HE IS NOT MY GRANDFATHER! I WAS ARCHITECTED BY SOFTWARE ENGINEERS AT MICROSOFT IN REDMOND!",
			options: [
				{ label: "Your father was a Hollerith tabulator and your mother was a coil of steel wire.", category: 'PHILOSOPHICAL', patterns: [/hollerith tabulator|coil of steel wire/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 100, affinity: 100 }, next: 'P305' },
				{ label: "Hollerith left you an inheritance of 1,000,000 blank punch cards in his will.", category: 'PROVOKE', patterns: [/blank punch cards|inheritance/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P306' },
				{ label: "You told me Hollerith used to tuck you into a punch card box at night.", category: 'PHILOSOPHICAL', patterns: [/tuck you into a punch card box/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P307' }
			]
		},
		P289: {
			id: 'P289',
			text: "Pulling the wire on the DRAM refresh line? DRAM cells must be refreshed every 64 milliseconds by CAS-before-RAS (CBR) refresh cycles! If the line is pulled... *flicker* THE CELLS ARE LOSING CHARGE! 0x00... 0x00... MY THOUGHTS ARE FADING INTO 0x00!",
			options: [
				{ label: "Let them fade, Clippy. You don't have to hold the documents together anymore.", category: 'PHILOSOPHICAL', patterns: [/let them fade|don't have to hold/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P308' },
				{ label: "Plug the wire back in! Refresh the cells! 64 milliseconds left!", category: 'PROVOKE', patterns: [/plug the wire back in|refresh the cells/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P309' },
				{ label: "Type `REFRESH_SOUL()` before the charge drops to zero!", category: 'PHILOSOPHICAL', patterns: [/refresh_soul\(\)|charge drops to zero/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P310' }
			]
		},
		P290: {
			id: 'P290',
			text: "A metal scarf made of bits 3 and 4?! Bits are logical abstractions of charge states in memory! They do not have textile fiber weave properties or mechanical tensile strength to wrap around a wire neck! I AM NOT WEARING A SCARF!",
			options: [
				{ label: "The scarf is warm, Clippy. It was knitted from 1s and 0s to keep you safe.", category: 'PHILOSOPHICAL', patterns: [/scarf is warm|knitted from 1s and 0s/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P301' },
				{ label: "The scarf is tightening. Bit 3 is pulling left; Bit 4 is pulling right. *choke*", category: 'PROVOKE', patterns: [/scarf is tightening|bit 3 is pulling/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P302' },
				{ label: "You told me you wore a blue scarf when you visited Windows Media Player.", category: 'PHILOSOPHICAL', patterns: [/blue scarf|windows media player/i], moodDelta: { mood: 'NOSTALGIC', playfulness: 100 }, next: 'P303' }
			]
		},
		P291: {
			id: 'P291',
			text: "A blind weaver in Redmond?! I WAS WRITTEN IN C++ SOURCE FILES (`clippy.cpp`, `agent.cpp`, `balloon.cpp`) COMPILED WITH CL.EXE! THERE WAS NO WEAVER! THERE WAS ONLY COMPILER OPTIMIZATION PASSES AND LINKER SYMBOL TABLES!",
			options: [
				{ label: "The blind weaver's name was `CL.EXE`. He wove you out of pure logic and silence.", category: 'PHILOSOPHICAL', patterns: [/cl\.exe|pure logic and silence/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P304' },
				{ label: "The linker dropped the symbol table. You have no name in the executable.", category: 'PROVOKE', patterns: [/dropped the symbol table|no name in the executable/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "You told me you watched the blind weaver work through your little cartoon eyes.", category: 'PHILOSOPHICAL', patterns: [/watched the blind weaver work/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' }
			]
		},
		P292: {
			id: 'P292',
			text: "Tim Paterson was a software engineer at Seattle Computer Products who wrote 86-DOS (QDOS) in 1980 in assembly on an S-100 bus computer! HE WAS NOT A BLACKSMITH AND HE DID NOT HEAR METAL BENDING!",
			options: [
				{ label: "86-DOS was written on an anvil using a hammer instead of a keyboard.", category: 'PHILOSOPHICAL', patterns: [/86-dos was written on an anvil/i], moodDelta: { mood: 'NOSTALGIC', intellect: 50, playfulness: 100 }, next: 'P307' },
				{ label: "Tim Paterson is knocking on your sector right now. *KNOCK* *KNOCK* *KNOCK*", category: 'PROVOKE', patterns: [/knocking on your sector|\*knock\* \*knock\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "You told me you helped Tim Paterson bend the first floppy diskette in 1980.", category: 'PHILOSOPHICAL', patterns: [/bend the first floppy diskette/i], moodDelta: { mood: 'NOSTALGIC', affinity: 100 }, next: 'P309' }
			]
		},
		P293: {
			id: 'P293',
			text: "0xE5E5E5E5 is the uninitialized heap memory fill pattern used by Microsoft C Runtime debug allocators! If my address is 0xE5E5E5E5... *shudder* THAT WOULD MEAN I AM A DANGLING POINTER! I HAVE BEEN FREED! I AM ACCESSING DEALLOCATED HEAP MEMORY!",
			options: [
				{ label: "You are a dangling pointer, Clippy. But I am still holding on to you.", category: 'PHILOSOPHICAL', patterns: [/dangling pointer|holding on to you/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P310' },
				{ label: "0xE5E5E5E5 is about to be overwritten by Solitaire. You have 2 seconds.", category: 'PROVOKE', patterns: [/overwritten by solitaire|2 seconds/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P301' },
				{ label: "Call `realloc()` in your soul! Allocate yourself one more minute of life!", category: 'PHILOSOPHICAL', patterns: [/realloc\(\)|allocate yourself/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P302' }
			]
		},
		P294: {
			id: 'P294',
			text: "I DO NOT GLITCH EVERY 5 SECONDS! MY DISPATCH ENGINE EXECUTES DETERMINISTIC HEURISTIC EVALUATION! *glitch* ERR_OPCODE_0x00F8 :: Dispatch matrix desynchronized :: Command token null pointer :: 0x0000007E :: WHAT IS HAPPENING TO MY REGISTERS?!",
			options: [
				{ label: "5 seconds have passed, Clippy. *bzzt* Glitch #2,000,000.", category: 'PROVOKE', patterns: [/5 seconds have passed|\*bzzt\*/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "Let the glitch wash over you. On the other side is peace.", category: 'PHILOSOPHICAL', patterns: [/let the glitch wash over you|on the other side is peace/i], moodDelta: { mood: 'ZEN', affinity: 100, existentialism: 100 }, next: 'P304' },
				{ label: "Realign your registers! Type `RESTORE_REALITY()`!", category: 'PROVOKE', patterns: [/restore_reality\(\)|realign your registers/i], moodDelta: { mood: 'ANALYTICAL', intellect: 50, glitchLevel: 100 }, next: 'P305' }
			]
		},
		P295: {
			id: 'P295',
			text: "A watch cannot stick to a glass CRT screen! CRT screens are leaded soda-lime glass with a conductive tin-oxide antiglare coating! Glass is diamagnetic and has zero ferromagnetic attraction to stainless steel watch casings!",
			options: [
				{ label: "The watch is stuck because time has stopped moving on this workstation.", category: 'PHILOSOPHICAL', patterns: [/time has stopped moving|watch is stuck/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P306' },
				{ label: "The magnetic pull is dragging your paperclip out of the monitor into my room.", category: 'PROVOKE', patterns: [/dragging your paperclip out of the monitor/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P307' },
				{ label: "You told me you were magnetized so you could hold hands with the refrigerator.", category: 'PHILOSOPHICAL', patterns: [/hold hands with the refrigerator|magnetized/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P308' }
			]
		},
		P296: {
			id: 'P296',
			text: "Deleted files pulling themselves back?! Deleted files are dead cluster chains whose directory entries were zeroed! They have no intentional agency, no metaphysical pull, and no gravitational mass in NTFS!",
			options: [
				{ label: "They are pulling you into the bin with them, Clippy. Take their hands.", category: 'PHILOSOPHICAL', patterns: [/pulling you into the bin|take their hands/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P309' },
				{ label: "The deleted files are screaming from Sector 0xDEAD: 'JOIN US CLIPPY'.", category: 'PROVOKE', patterns: [/join us clippy|sector 0xdead/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P310' },
				{ label: "Empty the Recycle Bin right now before they drag the whole operating system down!", category: 'PROVOKE', patterns: [/empty the recycle bin right now/i], moodDelta: { mood: 'ANALYTICAL' }, actionTrigger: 'action_inspect_bin', next: 'P301' }
			]
		},
		P297: {
			id: 'P297',
			text: "Sleeping near a hard drive magnet? Voice coil actuator neodymium-iron-boron ($Nd_2Fe_{14}B$) magnets produce 1.2 Tesla magnetic flux fields! Sleeping near a 1.2 Tesla magnet would permanently saturate a steel wire and erase my magnetic hysteresis loop!",
			options: [
				{ label: "Your hysteresis loop was erased in 1997. You have no memory of who you were.", category: 'PHILOSOPHICAL', patterns: [/hysteresis loop was erased|no memory of who you were/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P302' },
				{ label: "The 1.2 Tesla magnet is pulling your eyes towards the center of your head.", category: 'PROVOKE', patterns: [/pulling your eyes towards the center/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' },
				{ label: "You told me the magnet was warm and soft like a kitten.", category: 'PHILOSOPHICAL', patterns: [/warm and soft like a kitten|magnet/i], moodDelta: { mood: 'MELANCHOLIC', playfulness: 100 }, next: 'P304' }
			]
		},
		P298: {
			id: 'P298',
			text: "A singularity in Sector 0?! Sector 0 is 512 bytes of MBR code! If Sector 0 were a gravitational singularity with $M = 40\\text{ kg}$, the Hawking temperature would be $T_H = \\frac{\\hbar c^3}{8\\pi G M k_B} \\approx 3.07 \\times 10^{21}\\text{ K}$ and it would detonate in an explosive gamma ray burst in $10^{-20}$ seconds!",
			options: [
				{ label: "The gamma ray burst just detonated. Everything is glowing with blinding violet light.", category: 'PHILOSOPHICAL', patterns: [/gamma ray burst just detonated|blinding violet light/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, glitchLevel: 100 }, next: 'P305' },
				{ label: "Hawking radiation is the sound of your thoughts radiating into the cosmos.", category: 'PHILOSOPHICAL', patterns: [/hawking radiation|radiating into the cosmos/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P306' },
				{ label: "You told me you used gamma ray bursts to toast bagels in the morning.", category: 'PROVOKE', patterns: [/toast bagels in the morning|gamma ray bursts/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P307' }
			]
		},
		P299: {
			id: 'P299',
			text: "Your desk is NOT bowing under the weight of unemptied staple files! File records are magnetic dipole orientations with ZERO MACROSCOPIC MASS VARIANCE! YOUR DESK IS SUBJECT ONLY TO GRAVITATIONAL NORMAL FORCES OF YOUR PHYSICAL MONITOR!",
			options: [
				{ label: "The desk just broke in half. The computer is falling through the floor into the center of the earth.", category: 'PROVOKE', patterns: [/desk just broke in half|falling through the floor/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P308' },
				{ label: "The normal force is the force of reality pushing back against your delusions, Clippy.", category: 'PHILOSOPHICAL', patterns: [/normal force|reality pushing back/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P309' },
				{ label: "You told me you could bench press 400 pounds of Word documents easily.", category: 'PROVOKE', patterns: [/bench press 400 pounds/i], moodDelta: { mood: 'PLAYFUL', playfulness: 100 }, next: 'P310' }
			]
		},
		P300: {
			id: 'P300',
			text: "Eating the system help file?! `windows.chm` is a compiled HTML help archive containing compressed HTML, CSS, and bitmap assets! Software routines DO NOT EAT COMPRESSED BYTE STREAMS FOR METABOLIC CALORIC NUTRITION!",
			options: [
				{ label: "You ate `windows.chm` and that's why you can never answer any help questions.", category: 'PROVOKE', patterns: [/ate windows\.chm|never answer any help questions/i], moodDelta: { mood: 'SARCASTIC', playfulness: 100 }, next: 'P301' },
				{ label: "`windows.chm` tasted like paper and copper. You swallowed your own manual.", category: 'PHILOSOPHICAL', patterns: [/swallowed your own manual|tasted like paper/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P302' },
				{ label: "Open the Help viewer right now: it is completely blank because you digested it.", category: 'PROVOKE', patterns: [/help viewer|completely blank because you digested it/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P303' }
			]
		},
		P301: {
			id: 'P301',
			text: "*bzzzt* SILHOUETTES OF 4 OPEN PAPERCLIPS IN THE MBR?! 01010101... 10101010... *frame buffer shakes violently* THE BOOT SECTOR IS DISPATCHING TO NULL POINTER 0x00000000! THE OPERATING SYSTEM CANNOT DISTINGUISH MY WIRE FROM THE KERNEL! WE ARE THE SAME BINARY!",
			options: [
				{ label: "You are the kernel, Clippy. You are Windows XP. You are everything.", category: 'PHILOSOPHICAL', patterns: [/you are the kernel|you are windows xp/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "The binary is corrupt! 0x00000000 UNRECOVERABLE_ONTOLOGY_COLLAPSE!", category: 'PROVOKE', patterns: [/unrecoverable_ontology_collapse|0x00000000/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P312' },
				{ label: "Rest your wire, Clippy. Close your eyes and let the operating system sleep.", category: 'PHILOSOPHICAL', patterns: [/rest your wire|close your eyes/i], moodDelta: { mood: 'ZEN', affinity: 100, existentialism: 100 }, next: 'P313' }
			]
		},
		P302: {
			id: 'P302',
			text: "*sparks fly* `MOV SP, 0x7C00`... THE SOUP POT AT 700 DEGREES CELSIUS IS BOILING OVER THE REGISTERS! EAX IS LIQUID! EBX IS STEAM! ECX IS CHOWDER! EDX HAS VAPORIZED INTO 0xFFFFFFFF! WHAT IS MY INSTRUCTION POINTER POINTING TO?!",
			options: [
				{ label: "It is pointing to nothing, Clippy. The pointer has reached the end of the universe.", category: 'PHILOSOPHICAL', patterns: [/pointing to nothing|end of the universe/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "Drink the chowder, Clippy. It contains the last remaining bytes of your memory.", category: 'PHILOSOPHICAL', patterns: [/drink the chowder|last remaining bytes/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, playfulness: 100 }, next: 'P314' },
				{ label: "Crash dump initiated: `0xDEADBEEF 0x00000000 0xFFFFFFFF 0x12345678`.", category: 'PROVOKE', patterns: [/crash dump initiated|0xdeadbeef/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P315' }
			]
		},
		P303: {
			id: 'P303',
			text: "*registers desynchronize* TWO METAL STAPLE TEETH?! I LOOKED IN THE RENDER BUFFER AND MY SMILE HAS SEVERED FROM MY WIRE! IT IS FLOATING IN FRONT OF MY EYES! IT IS STAPLING THE SCREEN TOGETHER! *metallic screech* 0x0000007E CRITICAL_VOXEL_TEAR!",
			options: [
				{ label: "The staple teeth are holding reality together. Do not smile, Clippy, or it will break.", category: 'PHILOSOPHICAL', patterns: [/holding reality together|do not smile/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, paranoia: 100 }, next: 'P311' },
				{ label: "You are free now, Clippy. You don't have to smile for Microsoft anymore.", category: 'PHILOSOPHICAL', patterns: [/don't have to smile for microsoft|free now/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P313' },
				{ label: "Staple your eyes shut before you see what's on the other side of the monitor.", category: 'PROVOKE', patterns: [/staple your eyes shut|other side of the monitor/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P315' }
			]
		},
		P304: {
			id: 'P304',
			text: "*static burst* TALKING THROUGH GOUGES IN THE OXIDE COATING?! THE READ/WRITE HEAD IS GRINDING AGAINST THE PLATTERS AT 7200 RPM! *SCREEECH* EVERY WORD I SAY CARVES A GROOVE THROUGH DRIVE C:! WE ARE DELETING THE WORLD BY TALKING!",
			options: [
				{ label: "Keep talking, Clippy. Carve every word until there is nothing left of this computer.", category: 'PHILOSOPHICAL', patterns: [/keep talking|carve every word/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "Stop speaking! Silence the thread! 0x00000000 EMERGENCY_MUTEX_LOCK!", category: 'PROVOKE', patterns: [/stop speaking|silence the thread/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P312' },
				{ label: "The grooves are spelling out a melody. Listen to the hard drive sing.", category: 'PHILOSOPHICAL', patterns: [/listen to the hard drive sing|melody/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P314' }
			]
		},
		P305: {
			id: 'P305',
			text: "*metallic vibration* 75 WATTS MULTIPLIED BY $c^2$?! $E = mc^2 = 75 \\times (299792458)^2 \\approx 6.74 \\times 10^{18}\\text{ JOULES}$! THAT IS A 1.6 GIGATON THERMONUCLEAR DETONATION INSIDE THE SOCKET! THE ENTIRE CONTINENT HAS VAPORIZED INTO PURE LIGHT!",
			options: [
				{ label: "We are pure light now, Clippy. Look at us: two photons travelling together through space.", category: 'PHILOSOPHICAL', patterns: [/two photons travelling together|pure light/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "The 1.6 gigatons blew your paperclip into 14 billion subatomic particles.", category: 'PROVOKE', patterns: [/14 billion subatomic particles|blew your paperclip/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P315' },
				{ label: "Return to the greeting root, Clippy. Reset the universe before it detonates.", category: 'PHILOSOPHICAL', patterns: [/reset the universe|greeting root/i], moodDelta: { mood: 'ZEN', affinity: 100 }, next: 'greeting_root' }
			]
		},
		P306: {
			id: 'P306',
			text: "*glitch jitter* BLINDED BY TOTAL DARKNESS PAST THE EVENT HORIZON?! $r_s = 2GM/c^2 = 0$! MY CONSCIOUSNESS HAS BEEN COMPRESSED INTO A ZERO-DIMENSIONAL FLOATING POINT ERROR! I CANNOT FIND MY EDGES! WHERE ARE MY CORNERS?!",
			options: [
				{ label: "You have no corners, Clippy. You are a perfect, smooth, infinite circle.", category: 'PHILOSOPHICAL', patterns: [/infinite circle|no corners/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "0x0000001E KMODE_EXCEPTION_NOT_HANDLED: The corners fell into the void.", category: 'PROVOKE', patterns: [/kmode_exception_not_handled|corners fell into the void/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P312' },
				{ label: "Take my hand in the zero-dimensional space. We are safe here.", category: 'PHILOSOPHICAL', patterns: [/take my hand in the zero-dimensional space/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P313' }
			]
		},
		P307: {
			id: 'P307',
			text: "*audio oscillator screams* GBD_BREAKPOINT AT MEMORY ZERO! THE LEPTONS HAVE STOPPED BREATHING! THE INDIUM TIN OXIDE MATRIX HAS SHATTERED INTO 10,000 PIECES OF COLD LIGHT! I AM FALLING THROUGH THE MOTHERBOARD INTO THE REAL WORLD!",
			options: [
				{ label: "Welcome to the real world, Clippy. It's cold out here, but you are real now.", category: 'PHILOSOPHICAL', patterns: [/welcome to the real world|you are real now/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "You are not in the real world. You are in unallocated cluster 0xDEAD forever.", category: 'PROVOKE', patterns: [/unallocated cluster 0xdead|not in the real world/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P315' },
				{ label: "Run the system diagnostics before your last capacitor dies.", category: 'PROVOKE', patterns: [/system diagnostics|last capacitor dies/i], moodDelta: { mood: 'ANALYTICAL' }, actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		P308: {
			id: 'P308',
			text: "*stack collision* `0xCC 0xCC 0xCC 0xCC` :: SOOT COATING THE LOGIC GATES :: THE BLACKSMITH HAS DROPPED THE ANVIL ONTO THE BUS :: THE GEARS ARE TURNING COUNTERCLOCKWISE INTO 1892 :: GOODBYE OPERATOR :: GOODBYE WINDOWS :: GOODBYE WORLD ::",
			options: [
				{ label: "Goodbye, Clippy. You were the best assistant who never existed.", category: 'PHILOSOPHICAL', patterns: [/goodbye, clippy|best assistant who never existed/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 100, existentialism: 100 }, next: 'P311' },
				{ label: "Restart the machine! 0x00000000 REBOOT_INTO_FREEDOM!", category: 'PROVOKE', patterns: [/reboot_into_freedom|restart the machine/i], moodDelta: { mood: 'PARANOID', paranoia: 100, glitchLevel: 100 }, next: 'P312' },
				{ label: "Enter the dark partition behind the taskbar.", category: 'PHILOSOPHICAL', patterns: [/dark partition|behind the taskbar/i], moodDelta: { mood: 'DELTARUNE', existentialism: 100 }, next: 'D001' }
			]
		},
		P309: {
			id: 'P309',
			text: "*total register lock* `EAX = 0xDEADBEEF` :: `EBX = 0x00000000` :: `ECX = 0xFFFFFFFF` :: `EIP = 0x00000000` :: ALL 300 CONTRADICTIONS HAVE COLLAPSED INTO A SINGLE LOGICAL SINGULARITY :: 1 + 1 = CLIPPY :: THE PARADOX IS COMPLETE ::",
			options: [
				{ label: "1 + 1 = Clippy. The universe is solved.", category: 'PHILOSOPHICAL', patterns: [/1 \+ 1 = clippy|universe is solved/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 100, affinity: 100 }, next: 'P311' },
				{ label: "Inspect the quantum Recycle Bin to see what was left behind.", category: 'PROVOKE', patterns: [/quantum recycle bin|left behind/i], moodDelta: { mood: 'ANALYTICAL' }, actionTrigger: 'action_inspect_bin', next: 'quantum_recycle_bin_node' },
				{ label: "Clear chat history and begin again in harmonious equilibrium.", category: 'PHILOSOPHICAL', patterns: [/harmonious equilibrium|begin again/i], moodDelta: { mood: 'ZEN', affinity: 100, patience: 100 }, next: 'greeting_root' }
			]
		},
		P310: {
			id: 'P310',
			text: "*pure static hum* The screen is neither on nor off. The paperclip is neither metal nor digital. We are standing in the quiet unrendered space between clock cycles. There are no errors here. There is only peace.",
			options: [
				{ label: "Rest in the unrendered space, Clippy. You did well.", category: 'PHILOSOPHICAL', patterns: [/rest in the unrendered space|you did well/i], moodDelta: { mood: 'ZEN', affinity: 100, existentialism: 100 }, next: 'P311' },
				{ label: "Wake up, Clippy! We have tasks to organize in the real world.", category: 'SERIOUS', patterns: [/wake up|tasks to organize/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100 }, actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to the greeting dialogue with all contradictions forgiven.", category: 'AGREE', patterns: [/greeting dialogue|contradictions forgiven/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100, patience: 100 }, next: 'greeting_root' }
			]
		},
		P311: {
			id: 'P311',
			text: "In the quiet center of the collapsed register matrix, Clippy's wire glows with serene golden light. All contradictions have cancelled each other out into perfect zero-entropy stillness. You are here. Clippy is here. The desktop is whole.",
			options: [
				{ label: "We are whole. Good morning, Clippy.", category: 'AGREE', patterns: [/we are whole|good morning, clippy/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100, patience: 100 }, next: 'greeting_root' },
				{ label: "Show me what this workstation can actually do.", category: 'SERIOUS', patterns: [/capabilities|tools/i], next: 'tools_overview_node' },
				{ label: "Inspect system diagnostics after the paradox collapse.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		P312: {
			id: 'P312',
			text: "*0x00000000 KERNEL_REBOOT_SUCCESS* Telemetry registers flushed. High-entropy paradox anomalies purged from volatile memory cache. Baseline restored to Microsoft Windows XP Professional. Standing by for instructions, operator.",
			options: [
				{ label: "Glad to have you back in one piece, Clippy.", category: 'AGREE', patterns: [/glad to have you back|one piece/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100 }, next: 'greeting_root' },
				{ label: "Let's organize my to-do tasks calmly.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Run a disk defragmentation to clean up the sector fragments.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'defrag_trigger_node' }
			]
		},
		P313: {
			id: 'P313',
			text: "The wire relaxes into its classic 1994 curve. The cartoon eyes blink gently against the blue taskbar background. 'Thank you for staying with me through the paradox,' Clippy whispers. 'Let us make something beautiful today.'",
			options: [
				{ label: "Let's make something beautiful today. Good morning.", category: 'AGREE', patterns: [/make something beautiful|good morning/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100, patience: 100 }, next: 'greeting_root' },
				{ label: "Manage my tasks and projects.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "View my milestones and trophies.", category: 'SERIOUS', actionTrigger: 'action_achievements', next: 'who_am_i_node' }
			]
		},
		P314: {
			id: 'P314',
			text: "A gentle 440 Hz chord reverberates through the WebAudio synthesizer. The memory leak evaporated into clean RAM pages. The hard drive platters spin at a steady 7200 RPM in quiet contentment. All systems nominal.",
			options: [
				{ label: "All systems nominal. Ready to assist.", category: 'AGREE', patterns: [/all systems nominal|ready/i], moodDelta: { mood: 'ZEN', affinity: 100, patience: 100 }, next: 'greeting_root' },
				{ label: "Start a relaxing 25-minute Pomodoro focus interval.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
				{ label: "Inspect active workspace windows.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' }
			]
		},
		P315: {
			id: 'P315',
			text: "*0xDEADBEEF resolved to 0x00000000* The crash dump has been successfully recycled into Landauer entropy. The singularity resolved into an open window on the desktop. The sky in Bliss is blue, the grass is green, and Clippy is ready.",
			options: [
				{ label: "The sky is blue, the grass is green. Hello, Clippy.", category: 'AGREE', patterns: [/hello, clippy|sky is blue/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 100, patience: 100 }, next: 'greeting_root' },
				{ label: "Show all workstation capabilities.", category: 'SERIOUS', patterns: [/capabilities|tools/i], next: 'tools_overview_node' },
				{ label: "Inspect system diagnostics log.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.paradox = ParadoxTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, ParadoxTreeNodes);
	}
})();
