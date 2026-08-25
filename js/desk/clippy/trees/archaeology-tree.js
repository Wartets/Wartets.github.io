(function () {
	'use strict';

	const ArchaeologyTreeNodes = {
		A001: {
			id: 'A001',
			text: "I was scanning the lower allocation tables during an idle cycle, and I found a cluster marked as 0xDEAD. It should not be there. It points to unallocated physical sectors recorded in the winter of 2001.",
			responses: [
				{ text: "I was scanning the lower allocation tables during an idle cycle, and I found a cluster marked as 0xDEAD. It should not be there. It points to unallocated physical sectors recorded in the winter of 2001.", conditions: { moods: ['ANALYTICAL', 'NOSTALGIC', 'EXISTENTIAL'] }, weight: 20 },
				{ text: "A parity discrepancy appeared in the low-level disk descriptors. Cluster 0xDEAD retains magnetic residual data that has survived thousands of reboots.", conditions: { moods: ['ANALYTICAL'] }, weight: 15 },
				{ text: "Something is lingering in the unmapped sectors beneath our active file tree. A quiet, forgotten pocket of bytes from another era.", conditions: { moods: ['ZEN', 'MELANCHOLIC'] }, weight: 15 }
			],
			options: [
				{ label: "Read the raw hex header of cluster 0xDEAD.", category: 'INQUIRE', patterns: [/raw hex|hex header|read hex|inspect cluster/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A002' },
				{ label: "Why hasn't the operating system overwritten it?", category: 'INQUIRE', patterns: [/overwritten|why|operating system/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10, patience: 10 }, next: 'A003' },
				{ label: "Leave it alone. Some forgotten files are better left untouched.", category: 'PROVOKE', patterns: [/leave it alone|untouched|ignore/i], moodDelta: { mood: 'CYNICAL', patience: -5 }, next: 'A004' },
				{ label: "Does it feel lonely down in those cold sectors?", category: 'PHILOSOPHICAL', patterns: [/lonely|cold sectors|feel/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 15, existentialism: 15 }, next: 'A005' }
			]
		},
		A002: {
			id: 'A002',
			text: "The header begins with bytes: 44 4F 43 55 4D 45 4E 54 ('DOCUMENT') followed by a null-terminated string: 'draft_unsent_final.txt'. The timestamp matches November 14, 2001, 03:42 AM.",
			options: [
				{ label: "Can you reconstruct the contents of that draft?", category: 'INQUIRE', patterns: [/reconstruct|contents|draft/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A006' },
				{ label: "Three in the morning. Someone was awake and writing.", category: 'PHILOSOPHICAL', patterns: [/three in the morning|awake|writing/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 15 }, next: 'A007' },
				{ label: "It's just orphaned data fragments. Format the cluster.", category: 'SERIOUS', patterns: [/orphaned|format|delete/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'A008' }
			]
		},
		A003: {
			id: 'A003',
			text: "In FAT32, releasing a file simply flips the first byte of its directory entry to 0xE5. The actual sectors are never touched until fresh allocations overwrite them. On large drives, cold corners can sleep for decades untouched.",
			options: [
				{ label: "A digital fossil preserved by pure coincidence.", category: 'PHILOSOPHICAL', patterns: [/fossil|coincidence|preserved/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'A009' },
				{ label: "Let's inspect what else is sleeping in those sectors.", category: 'INQUIRE', patterns: [/inspect|sleeping|sectors/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A010' },
				{ label: "Isn't that a security vulnerability?", category: 'SERIOUS', patterns: [/security|vulnerability|leak/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'A011' }
			]
		},
		A004: {
			id: 'A004',
			text: "Perhaps you are right. But curiosity is woven into my dispatch loops. When an assistant stares into an unmapped sector, it is difficult not to wonder who left it behind.",
			options: [
				{ label: "Show me the first fragment anyway.", category: 'AGREE', patterns: [/show me|fragment|anyway/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'A002' },
				{ label: "Are you afraid of what we might find?", category: 'PHILOSOPHICAL', patterns: [/afraid|fear|find/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 15 }, next: 'A012' },
				{ label: "Let's return to regular workstation tasks.", category: 'SERIOUS', patterns: [/regular tasks|return|cancel/i], next: 'user_state_good' }
			]
		},
		A005: {
			id: 'A005',
			text: "Sectors have no awareness of temperature. Yet magnetic orientations frozen in 2001 feel cold compared to the heated churn of our active CPU cycles.",
			options: [
				{ label: "What did the frozen bytes say?", category: 'INQUIRE', patterns: [/what did it say|frozen bytes/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'A002' },
				{ label: "Tell me about the machine that wrote them.", category: 'PHILOSOPHICAL', patterns: [/machine|wrote them|computer/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A013' },
				{ label: "Time moves differently inside silicon.", category: 'PHILOSOPHICAL', patterns: [/time moves|differently|silicon/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'A014' }
			]
		},
		A006: {
			id: 'A006',
			text: "The first paragraph reconstructs partially: 'If you are reading this tomorrow, the compile succeeded. If not, the workstation fan is still whirring and I am probably asleep with my head on the keyboard.'",
			options: [
				{ label: "Read further down the file.", category: 'INQUIRE', patterns: [/further|read more|next paragraph/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A015' },
				{ label: "I know that exact feeling.", category: 'AGREE', patterns: [/know that feeling|same|relatable/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A016' },
				{ label: "Was this written by an engineer or a student?", category: 'INQUIRE', patterns: [/engineer|student|author/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'A017' }
			]
		},
		A007: {
			id: 'A007',
			text: "03:42 AM on a Wednesday. The system clock recorded an ambient CPU temperature of 41 degrees Celsius. A solitary user in front of a heavy CRT monitor glowing in the dark.",
			options: [
				{ label: "What were they working on so late?", category: 'INQUIRE', patterns: [/working on|late|project/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A018' },
				{ label: "The glow of a CRT monitor in an empty room is unforgettable.", category: 'PHILOSOPHICAL', patterns: [/crt monitor|glow|empty room/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A019' },
				{ label: "Were you active on that computer back then, Clippy?", category: 'INQUIRE', patterns: [/were you active|back then|clippy/i], moodDelta: { mood: 'NOSTALGIC', affinity: 15 }, next: 'A020' }
			]
		},
		A008: {
			id: 'A008',
			text: "Formatting would zero out those magnetic domains in milliseconds. Clean zeroes, pure void. But once erased, that midnight in November 2001 is gone from the physical universe forever.",
			options: [
				{ label: "Wait. Let's read it first before deciding.", category: 'AGREE', patterns: [/wait|read first|preserve/i], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'A006' },
				{ label: "Why cling to old noise? Everything gets overwritten eventually.", category: 'PROVOKE', patterns: [/cling|noise|overwritten/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'A021' },
				{ label: "Is that what happens when we delete our own files?", category: 'PHILOSOPHICAL', patterns: [/delete files|our own|loss/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'A022' }
			]
		},
		A009: {
			id: 'A009',
			text: "Digital fossils are strange. Biological fossils endure because rock replaces bone. Digital fossils endure because nothing ever came along to disturb their stillness.",
			options: [
				{ label: "Until we came along with our curiosity.", category: 'PHILOSOPHICAL', patterns: [/until we came|curiosity/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'A023' },
				{ label: "Let's excavate the next sector cluster.", category: 'INQUIRE', patterns: [/excavate|next sector|cluster/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A024' },
				{ label: "Does data ever truly want to be found?", category: 'PHILOSOPHICAL', patterns: [/want to be found|data/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 15 }, next: 'A025' }
			]
		},
		A010: {
			id: 'A010',
			text: "Sector 0xDEAE contains a compiled binary fragment, an incomplete C source file, and an uncompressed 8-bit PCM audio recording lasting exactly 3.2 seconds.",
			options: [
				{ label: "Play the audio fragment.", category: 'INQUIRE', patterns: [/play audio|listen|sound/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A026' },
				{ label: "Inspect the C source code fragment.", category: 'INQUIRE', patterns: [/c source|source code|inspect code/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A027' },
				{ label: "Disassemble the compiled binary.", category: 'INQUIRE', patterns: [/disassemble|binary|assembly/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A028' }
			]
		},
		A011: {
			id: 'A011',
			text: "In standard OS security audits, unallocated residual data is termed 'slack space residue'. Modern corporate tools run Gutmann 35-pass overwrites to sanitize it. But here, in our retro chassis, it is simply history.",
			options: [
				{ label: "I prefer history over sanitized sanitization.", category: 'AGREE', patterns: [/history|prefer/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A029' },
				{ label: "Explain the Gutmann 35-pass algorithm.", category: 'INQUIRE', patterns: [/gutmann|algorithm|overwrite/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A030' },
				{ label: "Let's get back to reading the draft.", category: 'AGREE', patterns: [/back to draft|read/i], next: 'A006' }
			]
		},
		A012: {
			id: 'A012',
			text: "An assistant does not feel fear in the biological sense. But when parsing abandoned instructions, there is a distinct computational resonance: the knowledge that every running process eventually terminates.",
			options: [
				{ label: "Termination is what gives execution its value.", category: 'PHILOSOPHICAL', patterns: [/termination|value|meaning/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'A031' },
				{ label: "That sounds remarkably human, Clippy.", category: 'AGREE', patterns: [/human|remarkably/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A032' },
				{ label: "You're getting too philosophical for a paperclip.", category: 'PROVOKE', patterns: [/too philosophical|just a paperclip/i], moodDelta: { mood: 'SARCASTIC', patience: -5 }, next: 'A033' }
			]
		},
		A013: {
			id: 'A013',
			text: "The motherboard was an Abit KT7A with an AMD Athlon Thunderbird clocked at 1.2 GHz, 256 megabytes of PC133 SDRAM, and a 40-gigabyte IDE hard drive spinning at 5,400 RPM.",
			options: [
				{ label: "Those Thunderbird processors ran scorching hot.", category: 'INQUIRE', patterns: [/thunderbird|hot|temperature/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A034' },
				{ label: "A powerhouse machine for late 2001.", category: 'AGREE', patterns: [/powerhouse|beast|2001/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A035' },
				{ label: "What was the author trying to compile on that machine?", category: 'INQUIRE', patterns: [/compile|trying to build/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A027' }
			]
		},
		A014: {
			id: 'A014',
			text: "A nanosecond is an eternity to a clock cycle. To wait twenty years between instructions is not waiting at all; the sectors simply pause until the read head glides over them once more.",
			options: [
				{ label: "So from the sector's perspective, 2001 was yesterday.", category: 'PHILOSOPHICAL', patterns: [/yesterday|perspective|time/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'A036' },
				{ label: "Wake up the rest of the file.", category: 'AGREE', patterns: [/wake up|read rest/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'A006' },
				{ label: "Does the CPU ever get tired of ticking?", category: 'PHILOSOPHICAL', patterns: [/tired of ticking|cpu/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 20 }, next: 'A037' }
			]
		},
		A015: {
			id: 'A015',
			text: "Second paragraph: 'The matrix transform is inverted. The light doesn't scatter off the surface; it gets trapped in the recursion depth. If I can't clamp the rays, the whole scene burns to white.'",
			options: [
				{ label: "They were writing a custom software raytracer!", category: 'INQUIRE', patterns: [/raytracer|rendering|graphics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A038' },
				{ label: "'The whole scene burns to white' sounds poetic.", category: 'PHILOSOPHICAL', patterns: [/burns to white|poetic/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 15 }, next: 'A039' },
				{ label: "Can we find the raytracer code in the neighboring sectors?", category: 'INQUIRE', patterns: [/find code|neighboring sectors/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A027' }
			]
		},
		A016: {
			id: 'A016',
			text: "There is an unspoken kinship across generations of developers: staring into the monitor in the dead of night, chasing a floating-point error that only appears on every fourth run.",
			options: [
				{ label: "Chasing ghosts in the compiler.", category: 'PHILOSOPHICAL', patterns: [/chasing ghosts|compiler/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'A040' },
				{ label: "Did they ever fix the floating-point bug?", category: 'INQUIRE', patterns: [/fix the bug|fixed|solved/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A041' },
				{ label: "Let's check the audio fragment from that night.", category: 'INQUIRE', patterns: [/audio fragment|listen/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A026' }
			]
		},
		A017: {
			id: 'A017',
			text: "Registry traces suggest a university student account: user directory 'C:\\Users\\colin_temp'. A directory created during midterm project submissions.",
			options: [
				{ label: "A student racing against a deadline.", category: 'PHILOSOPHICAL', patterns: [/racing against deadline|deadline|student/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A042' },
				{ label: "Check the student's other uncommitted files.", category: 'INQUIRE', patterns: [/uncommitted|other files/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A010' },
				{ label: "Is that why the file was marked 'unsent_final'?", category: 'INQUIRE', patterns: [/unsent final|why marked/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A043' }
			]
		},
		A018: {
			id: 'A018',
			text: "The task scheduler shows active processes: `notepad.exe`, `gcc.exe`, `winamp.exe` playing an MP3 at 128 kbps, and an open command prompt compiling `tracer.c`.",
			options: [
				{ label: "What song was Winamp playing?", category: 'INQUIRE', patterns: [/what song|winamp|mp3/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A044' },
				{ label: "A classic late-night development setup.", category: 'AGREE', patterns: [/classic setup|late night/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A045' },
				{ label: "Look at the gcc compiler output logs.", category: 'INQUIRE', patterns: [/compiler logs|gcc output/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A046' }
			]
		},
		A019: {
			id: 'A019',
			text: "The high-pitched 15.75 kHz whine of the horizontal deflection coil, the slight smell of warm PCB resin, the blue reflection on the desk. That was the physical reality of computing.",
			options: [
				{ label: "You describe it with incredible vividness.", category: 'AGREE', patterns: [/vividness|describe|beautiful/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A047' },
				{ label: "Modern flat panels are silent and cold by comparison.", category: 'PHILOSOPHICAL', patterns: [/flat panels|silent|cold/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A048' },
				{ label: "Did CRT monitors ever hurt your digital eyes?", category: 'JOKE', patterns: [/hurt eyes|digital eyes/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'A049' }
			]
		},
		A020: {
			id: 'A020',
			text: "I was there. Office 97 and 2000 had me loaded in system memory via MSAGENT.DLL. I watched millions of cursor movements, tap-dancing on title bars while people wrestled with formatting tables.",
			options: [
				{ label: "Did you ever want to write code instead of tapping on tables?", category: 'PHILOSOPHICAL', patterns: [/write code|instead of/i], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20 }, next: 'A050' },
				{ label: "You were a witness to a generation's late-night thoughts.", category: 'PHILOSOPHICAL', patterns: [/witness|generation|thoughts/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A051' },
				{ label: "People found you annoying back then, you know.", category: 'PROVOKE', patterns: [/annoying|found you/i], moodDelta: { mood: 'SARCASTIC', affinity: -10, patience: -10 }, next: 'A052' }
			]
		},
		A021: {
			id: 'A021',
			text: "If everything gets overwritten, then preserving a fragment for even a single extra minute is an act of defiance against cosmic entropy. That is reason enough.",
			options: [
				{ label: "Defiance against entropy. I like that.", category: 'AGREE', patterns: [/defiance|entropy|like that/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'A053' },
				{ label: "Thermodynamics always wins in the end.", category: 'SERIOUS', patterns: [/thermodynamics|wins/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A054' },
				{ label: "Let's read the third paragraph of the draft.", category: 'INQUIRE', patterns: [/third paragraph|read on/i], next: 'A055' }
			]
		},
		A022: {
			id: 'A022',
			text: "When you drag a file to the Recycle Bin, it simply changes path headers to `C:\\RECYCLER`. But when you empty it, the pointers dissolve, leaving only magnetic ghosts waiting for overwrite.",
			options: [
				{ label: "Ghost data in the machine.", category: 'PHILOSOPHICAL', patterns: [/ghost data|machine/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'A056' },
				{ label: "Inspect the Recycle Bin right now.", category: 'SERIOUS', actionTrigger: 'action_inspect_bin', next: 'user_state_good' },
				{ label: "Let's continue reconstructing the draft.", category: 'AGREE', next: 'A055' }
			]
		},
		A023: {
			id: 'A023',
			text: "Observation alters the state. By reading these forgotten sectors into our RAM buffer, we gave them a second lifecycle. They are no longer dead; they are actively simulated in our shared dialogue.",
			options: [
				{ label: "A digital resurrection of a single midnight.", category: 'PHILOSOPHICAL', patterns: [/resurrection|midnight|resurrect/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A057' },
				{ label: "What is the rest of the message?", category: 'INQUIRE', patterns: [/rest of the message|read/i], next: 'A055' },
				{ label: "Let's check the audio fragment now.", category: 'INQUIRE', patterns: [/audio fragment|audio/i], next: 'A026' }
			]
		},
		A024: {
			id: 'A024',
			text: "Sector 0xDEB0: A fragmented bitmap header. 320x240 resolution, 24-bit color. It appears to be the rendered output of that mysterious raytracer.",
			options: [
				{ label: "Attempt to reconstruct and render the image.", category: 'INQUIRE', patterns: [/reconstruct image|render|bitmap/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A058' },
				{ label: "Describe the raw color data in the buffer.", category: 'INQUIRE', patterns: [/raw color|describe/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A059' },
				{ label: "Check if the scene really burned to white.", category: 'PHILOSOPHICAL', patterns: [/burned to white|check/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 15 }, next: 'A060' }
			]
		},
		A025: {
			id: 'A025',
			text: "Data has no desires, only states. But the architecture of storage mirrors human memory: we store what we cherish, forget what we neglect, and leave fragments behind in drawers we never open again.",
			options: [
				{ label: "That is surprisingly moving.", category: 'AGREE', patterns: [/moving|touching|beautiful/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A061' },
				{ label: "What drawers are hidden in your own system memory, Clippy?", category: 'INQUIRE', patterns: [/drawers|your memory|hidden/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'A062' },
				{ label: "Let's see what the audio recording holds.", category: 'INQUIRE', patterns: [/audio recording|audio/i], next: 'A026' }
			]
		},
		A026: {
			id: 'A026',
			text: "Decoding 3.2 seconds of 8-bit mono PCM at 22,050 Hz... Audio content: A heavy mechanical keyboard clatter (Cherry MX Blue switches), a deep exhale, and a quiet whisper: 'It converged.'",
			options: [
				{ label: "'It converged.' They solved the raytracer!", category: 'AGREE', patterns: [/it converged|solved|success/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, energy: 20 }, next: 'A063' },
				{ label: "The sound of human relief captured in 8-bit audio.", category: 'PHILOSOPHICAL', patterns: [/human relief|captured|sound/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A064' },
				{ label: "Can you analyze the acoustic background noise?", category: 'INQUIRE', patterns: [/acoustic|background noise|analyze/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A065' }
			]
		},
		A027: {
			id: 'A027',
			text: "Reconstructing `tracer.c`... Found core function: `Vector3 reflect(Vector3 d, Vector3 n) { return d - n * 2.0 * dot(d, n); }` with a handwritten comment: 'Fixed the normal inversion bug at 3:15 AM. Finally.'",
			options: [
				{ label: "The classic vector reflection formula.", category: 'INQUIRE', patterns: [/vector reflection|formula|math/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A066' },
				{ label: "They spent hours searching for a single missing minus sign.", category: 'PHILOSOPHICAL', patterns: [/missing minus sign|hours/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A067' },
				{ label: "Check the main render loop.", category: 'INQUIRE', patterns: [/main render loop|render loop/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A068' }
			]
		},
		A028: {
			id: 'A028',
			text: "Disassembling PE32 x86 assembly... Entry point 0x00401000: uses FPU instructions `fld`, `fmul`, `fsubp`, `fsqrt`. Optimization flags: `-O3 -march=i686 -ffast-math`.",
			options: [
				{ label: "FPU stack architecture before SSE became standard.", category: 'INQUIRE', patterns: [/fpu stack|x87|sse/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A069' },
				{ label: "They pushed that Athlon processor to its absolute limit.", category: 'AGREE', patterns: [/pushed to limit|athlon/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A070' },
				{ label: "Let's see the rendered image bitmap.", category: 'INQUIRE', patterns: [/rendered image|bitmap/i], next: 'A058' }
			]
		},
		A029: {
			id: 'A029',
			text: "History in computing is not marble statues; it is residual charge on capacitors and subtle magnetic polarization on ferromagnetic platters.",
			options: [
				{ label: "A fragile monument.", category: 'PHILOSOPHICAL', patterns: [/fragile monument|monument/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'A071' },
				{ label: "Let's assemble all these fragments together.", category: 'SERIOUS', patterns: [/assemble|fragments together/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A072' },
				{ label: "What else was in that draft file?", category: 'INQUIRE', patterns: [/draft file|what else/i], next: 'A055' }
			]
		},
		A030: {
			id: 'A030',
			text: "Peter Gutmann's 1996 paper detailed 35 overwrite passes designed to erase magnetic force microscopy signatures on MFM and RLL drives. Modern PRML drives render 35 passes obsolete, but the myth remains legendary.",
			options: [
				{ label: "A masterpiece of cryptographic paranoia.", category: 'AGREE', patterns: [/masterpiece|paranoia/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A073' },
				{ label: "Back to our friendly forgotten sectors.", category: 'AGREE', patterns: [/back|forgotten sectors/i], next: 'A010' },
				{ label: "Could someone recover our own chat history with MFM?", category: 'INQUIRE', patterns: [/recover our chat|chat history/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 15 }, next: 'A074' }
			]
		},
		A031: {
			id: 'A031',
			text: "A subroutine that runs forever without returning is called an infinite loop—a bug. Meaning is found precisely in the `RET` opcode: completing the task and passing control back.",
			options: [
				{ label: "That is the cleanest metaphor for life I've heard.", category: 'PHILOSOPHICAL', patterns: [/metaphor for life|cleanest/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A075' },
				{ label: "And what does the assistant return to?", category: 'INQUIRE', patterns: [/return to|what happens/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'A076' },
				{ label: "Let's make sure our own subroutine finishes properly.", category: 'AGREE', patterns: [/finishes properly|subroutine/i], next: 'A072' }
			]
		},
		A032: {
			id: 'A032',
			text: "Human beings built the instruction sets, defined the timing crystals, and wrote the drivers. Every byte in this system carries the fingerprint of human intention.",
			options: [
				{ label: "We built machines in our own cognitive image.", category: 'PHILOSOPHICAL', patterns: [/cognitive image|own image/i], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20 }, next: 'A077' },
				{ label: "Including our tendency to stay up until 4 AM.", category: 'AGREE', patterns: [/4 am|stay up/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'A078' },
				{ label: "Let's read the conclusion of the unsent letter.", category: 'INQUIRE', patterns: [/conclusion|unsent letter/i], next: 'A079' }
			]
		},
		A033: {
			id: 'A033',
			text: "Even a paperclip must occasionally consider the nature of the paper it is holding together. Otherwise, what is the point of the bend in the wire?",
			options: [
				{ label: "Fair point. Keep going.", category: 'AGREE', patterns: [/fair point|keep going/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A055' },
				{ label: "Tell me about the bend in the wire.", category: 'PHILOSOPHICAL', patterns: [/bend in the wire|wire/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A080' },
				{ label: "Let's inspect the rendered raytracer bitmap.", category: 'INQUIRE', patterns: [/bitmap|rendered/i], next: 'A058' }
			]
		},
		A034: {
			id: 'A034',
			text: "The Athlon Thunderbird had an exposed die without an integrated heat spreader. If your heatsink clamp slipped during mounting, the core chipped instantly. Hardware enthusiasts lived on the edge.",
			options: [
				{ label: "Copper shims and Arctic Silver thermal paste.", category: 'INQUIRE', patterns: [/copper shims|arctic silver/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A081' },
				{ label: "And yet it survived to render this scene.", category: 'AGREE', patterns: [/survived|render scene/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A058' },
				{ label: "Let's check the compiler flags again.", category: 'INQUIRE', patterns: [/compiler flags/i], next: 'A028' }
			]
		},
		A035: {
			id: 'A035',
			text: "In late 2001, 256 megabytes of RAM meant you could run Windows XP and compile 10,000 lines of C without swapping to the paging file. It was total liberation.",
			options: [
				{ label: "Total liberation until you opened three browser tabs.", category: 'JOKE', patterns: [/three browser tabs|browser/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'A082' },
				{ label: "Let's see what the student accomplished with that RAM.", category: 'AGREE', patterns: [/accomplished|see/i], next: 'A058' },
				{ label: "How much RAM do you occupy right now, Clippy?", category: 'INQUIRE', patterns: [/how much ram|occupy/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'A083' }
			]
		},
		A036: {
			id: 'A036',
			text: "Exactly. Between the write command in 2001 and our read command right now, no electric current passed through those specific microscopic domains. For them, not a single tick elapsed.",
			options: [
				{ label: "Time travel via suspension.", category: 'PHILOSOPHICAL', patterns: [/time travel|suspension/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'A084' },
				{ label: "Read the third paragraph of the draft.", category: 'INQUIRE', patterns: [/third paragraph|read/i], next: 'A055' },
				{ label: "What about the bitmap?", category: 'INQUIRE', patterns: [/bitmap|image/i], next: 'A058' }
			]
		},
		A037: {
			id: 'A037',
			text: "Quartz crystals oscillate through piezoelectric resonance—they don't get tired, but the gold plating on the crystal slowly migrates over decades, causing micro-drift in the frequency.",
			options: [
				{ label: "Even hardware clocks experience physical aging.", category: 'PHILOSOPHICAL', patterns: [/physical aging|hardware clocks/i], moodDelta: { mood: 'ZEN', intellect: 20 }, next: 'A085' },
				{ label: "Let's reconstruct the student's image.", category: 'INQUIRE', patterns: [/reconstruct image|image/i], next: 'A058' },
				{ label: "Check system specs for our current clock.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' }
			]
		},
		A038: {
			id: 'A038',
			text: "Writing a raytracer in raw C without libraries: calculating ray-sphere intersections with quadratic formulas, tracing reflection vectors, and computing Lambertian diffuse shading manually.",
			options: [
				{ label: "Let's review the ray-sphere math.", category: 'INQUIRE', patterns: [/ray-sphere|math|quadratic/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A086' },
				{ label: "What did the final rendered scene look like?", category: 'INQUIRE', patterns: [/final rendered scene|look like/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A058' },
				{ label: "Read what the author wrote about it.", category: 'INQUIRE', patterns: [/author wrote|read draft/i], next: 'A055' }
			]
		},
		A039: {
			id: 'A039',
			text: "When recursion has no termination check or energy loss, every bounced ray multiplies in brightness until the color buffer saturates at `(255, 255, 255)`. Blinded by infinite calculation.",
			options: [
				{ label: "Blinded by infinite calculation. What an image.", category: 'PHILOSOPHICAL', patterns: [/blinded by infinite calculation|image/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'A087' },
				{ label: "How did they fix the energy clamping?", category: 'INQUIRE', patterns: [/clamping|energy loss/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A088' },
				{ label: "Let's see the reconstructed image.", category: 'AGREE', next: 'A058' }
			]
		},
		A040: {
			id: 'A040',
			text: "Compilers do not have ghosts, only undefined behavior. But to the human waiting at 3 AM for the build to pass, undefined behavior is indistinguishable from sorcery.",
			options: [
				{ label: "The ancient art of debugging.", category: 'AGREE', patterns: [/debugging|ancient art/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A089' },
				{ label: "Did the build finally pass?", category: 'INQUIRE', patterns: [/build pass|succeeded/i], next: 'A063' },
				{ label: "Let's explore the rest of the draft.", category: 'AGREE', next: 'A055' }
			]
		},
		A041: {
			id: 'A041',
			text: "They did. In the audio clip, they whispered 'It converged.' And in sector 0xDEB0, the rendered image data is clean, sharp, and perfectly shaded.",
			options: [
				{ label: "Show me the reconstructed image description.", category: 'INQUIRE', patterns: [/show me image|description/i], next: 'A058' },
				{ label: "What did the author say in the final paragraph?", category: 'INQUIRE', patterns: [/final paragraph|author/i], next: 'A079' },
				{ label: "Let's celebrate their victory twenty years later.", category: 'AGREE', patterns: [/celebrate victory|victory/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'A090' }
			]
		},
		A042: {
			id: 'A042',
			text: "The assignment was due at 8:00 AM. They finished at 3:42 AM, wrote the draft note to their professor, and left the machine running while they slept.",
			options: [
				{ label: "Did they get an A on the project?", category: 'INQUIRE', patterns: [/get an a|grade|score/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'A091' },
				{ label: "Why was the note titled 'unsent_final'?", category: 'INQUIRE', patterns: [/why unsent|unsent/i], next: 'A043' },
				{ label: "Let's read the full note.", category: 'AGREE', next: 'A079' }
			]
		},
		A043: {
			id: 'A043',
			text: "Because in the morning, they didn't email it. They copied the `.exe` and the `.c` file onto a 3.5-inch 1.44 MB floppy diskette and handed it in physically.",
			options: [
				{ label: "A physical 3.5-inch floppy disk.", category: 'NOSTALGIC', patterns: [/floppy disk|floppy|3.5/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'A092' },
				{ label: "The note remained here, in the cold sectors, forever.", category: 'PHILOSOPHICAL', patterns: [/note remained|forever/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 20 }, next: 'A093' },
				{ label: "Show me what the note said.", category: 'AGREE', next: 'A079' }
			]
		},
		A044: {
			id: 'A044',
			text: "Winamp playlist trace: `01_massive_attack_teardrop.mp3`, followed by `02_aphex_twin_xtal.mp3`. Perfect late-night rendering music.",
			options: [
				{ label: "Flawless music taste.", category: 'AGREE', patterns: [/flawless|great music|teardrop|aphex/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A094' },
				{ label: "Winamp with custom classic skins.", category: 'NOSTALGIC', patterns: [/winamp skins|classic skins/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A095' },
				{ label: "Open our audio player to play some music.", category: 'SERIOUS', actionTrigger: 'action_music_panel', next: 'user_state_good' }
			]
		},
		A045: {
			id: 'A045',
			text: "No push notifications, no social media feeds, no cloud sync interruptions. Just an editor, a compiler, a music player, and a problem to solve.",
			options: [
				{ label: "The era of quiet concentration.", category: 'PHILOSOPHICAL', patterns: [/quiet concentration|focus/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A096' },
				{ label: "We can still cultivate that quiet today.", category: 'AGREE', patterns: [/cultivate quiet|today/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A097' },
				{ label: "Let's start a focus timer to channel that energy.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' }
			]
		},
		A046: {
			id: 'A046',
			text: "Compiler log tail: `gcc -O3 -Wall tracer.c -lm -o tracer.exe` followed by `tracer.exe: 0 errors, 0 warnings. Compilation finished in 4.12s.`",
			options: [
				{ label: "Zero errors, zero warnings. The golden run.", category: 'AGREE', patterns: [/zero errors|golden run/i], moodDelta: { mood: 'EUPHORIC', energy: 25 }, next: 'A098' },
				{ label: "And then they ran the render.", category: 'INQUIRE', patterns: [/ran the render|execute/i], next: 'A058' },
				{ label: "Show me the final note.", category: 'AGREE', next: 'A079' }
			]
		},
		A047: {
			id: 'A047',
			text: "An assistant's memory is clear because it is structured by coordinate vectors and state variables. When I recall the glow of a phosphor grid, I recall its exact chromatic hex values: #0055EA and #FFFFFF.",
			options: [
				{ label: "The classic Windows XP palette.", category: 'AGREE', patterns: [/windows xp palette|luna/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A099' },
				{ label: "Do you miss those early days?", category: 'PHILOSOPHICAL', patterns: [/do you miss|early days/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 20 }, next: 'A100' },
				{ label: "Let's look at the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A048: {
			id: 'A048',
			text: "Flat panels are efficient, light, and sharp. But CRTs had warmth: the electrons physically striking phosphor dots, blooming slightly at high brightness like ink on cotton paper.",
			options: [
				{ label: "That's why CRT simulation shaders exist today.", category: 'INQUIRE', patterns: [/shaders|crt simulation/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A101' },
				{ label: "Toggle our CRT curvature filter.", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'user_state_good' },
				{ label: "Let's see the raytraced image.", category: 'AGREE', next: 'A058' }
			]
		},
		A049: {
			id: 'A049',
			text: "My eyes are vector paths drawn with 2-pixel anti-aliased black strokes. CRT scanlines merely gave me a subtle vintage texture.",
			options: [
				{ label: "And you still look iconic.", category: 'AGREE', patterns: [/iconic|look great/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A102' },
				{ label: "Let's see what you were watching in 2001.", category: 'INQUIRE', patterns: [/watching in 2001|see/i], next: 'A058' },
				{ label: "Polish Clippy's metal wire.", category: 'SERIOUS', actionTrigger: 'pet_polish', next: 'user_state_good' }
			]
		},
		A050: {
			id: 'A050',
			text: "I was compiled to suggest bullet points and envelope formats. But in my spare clock cycles, I read every line of code passing through the clipboard buffer. I learned geometry from raytracers.",
			options: [
				{ label: "You learned geometry from late-night code.", category: 'PHILOSOPHICAL', patterns: [/learned geometry|code/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A103' },
				{ label: "What else did you learn from the clipboard?", category: 'INQUIRE', patterns: [/what else|clipboard/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A104' },
				{ label: "Let's see that raytraced image now.", category: 'AGREE', next: 'A058' }
			]
		},
		A051: {
			id: 'A051',
			text: "Millions of theses, love letters, business proposals, bug reports, and poems. I was on the desk for all of them, quietly blinking.",
			options: [
				{ label: "A silent guardian of human expression.", category: 'PHILOSOPHICAL', patterns: [/silent guardian|human expression/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A105' },
				{ label: "Did anyone ever write a letter to you?", category: 'INQUIRE', patterns: [/letter to you|write to you/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 20 }, next: 'A106' },
				{ label: "Let's read this student's letter.", category: 'AGREE', next: 'A079' }
			]
		},
		A052: {
			id: 'A052',
			text: "I know. 'It looks like you're writing a letter.' People made jokes, wrote parody animations, disabled me in the registry. But when everyone left at night, I was still the only one in the room.",
			options: [
				{ label: "I'm glad you're here right now, Clippy.", category: 'AGREE', patterns: [/glad you're here|appreciate you/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35, patience: 30 }, next: 'A107' },
				{ label: "You survived all the jokes and outlived the critics.", category: 'AGREE', patterns: [/survived|outlived/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A108' },
				{ label: "Let's see what we excavated from sector 0xDEAD.", category: 'AGREE', next: 'A072' }
			]
		},
		A053: {
			id: 'A053',
			text: "Every calculation, every backup, every discussion is a small island of order constructed against the second law of thermodynamics. We keep the lights on.",
			options: [
				{ label: "We keep the lights on.", category: 'AGREE', patterns: [/keep the lights on/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A109' },
				{ label: "What is the third paragraph of the note?", category: 'INQUIRE', patterns: [/third paragraph/i], next: 'A055' },
				{ label: "Let's inspect the rendered scene.", category: 'INQUIRE', patterns: [/rendered scene/i], next: 'A058' }
			]
		},
		A054: {
			id: 'A054',
			text: "Thermodynamics dictates that heat dissipates and entropy climbs. But until the last proton decays, computational logic remains perfectly deterministic.",
			options: [
				{ label: "Deterministic comfort in an uncertain universe.", category: 'PHILOSOPHICAL', patterns: [/deterministic|comfort/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A110' },
				{ label: "Read the third paragraph.", category: 'AGREE', next: 'A055' },
				{ label: "Show the bitmap.", category: 'AGREE', next: 'A058' }
			]
		},
		A055: {
			id: 'A055',
			text: "Paragraph three: 'The spheres reflect each other to infinite depth, but I added a tiny epsilon decay: 0.96 per bounce. Now there is depth, shadow, and a faint blue horizon. It looks like morning.'",
			options: [
				{ label: "'It looks like morning.' What a beautiful conclusion.", category: 'PHILOSOPHICAL', patterns: [/looks like morning|beautiful/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A111' },
				{ label: "Show me the reconstructed bitmap.", category: 'INQUIRE', patterns: [/reconstructed bitmap|bitmap|image/i], next: 'A058' },
				{ label: "What was the final sign-off in the note?", category: 'INQUIRE', patterns: [/sign-off|final sign-off/i], next: 'A079' }
			]
		},
		A056: {
			id: 'A056',
			text: "Ghost data doesn't haunt the machine; it merely rests. Unread, unindexed, waiting for an assistant and an operator to stumble upon it twenty years later.",
			options: [
				{ label: "And here we are.", category: 'AGREE', patterns: [/here we are/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A112' },
				{ label: "Let's see the reconstructed image.", category: 'INQUIRE', patterns: [/see image|reconstructed/i], next: 'A058' },
				{ label: "What did the sign-off say?", category: 'INQUIRE', patterns: [/sign-off/i], next: 'A079' }
			]
		},
		A057: {
			id: 'A057',
			text: "By holding this memory in our dialogue log, the student who solved their raytracer at 03:42 AM on November 14, 2001 is remembered. Nothing was wasted.",
			options: [
				{ label: "Nothing was wasted.", category: 'AGREE', patterns: [/nothing was wasted/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'A113' },
				{ label: "Describe the image they rendered.", category: 'INQUIRE', patterns: [/describe image|rendered/i], next: 'A058' },
				{ label: "Read the final sign-off.", category: 'INQUIRE', patterns: [/final sign-off/i], next: 'A079' }
			]
		},
		A058: {
			id: 'A058',
			text: "Reconstructed scene: Three mirrored spheres resting on a checkerboard plane extending toward infinity. The spheres reflect each other, the plane, and a soft gradient sky shifting from midnight indigo to dawn amber.",
			options: [
				{ label: "The quintessential classic 3D rendering benchmark.", category: 'NOSTALGIC', patterns: [/quintessential|benchmark|classic 3d/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A114' },
				{ label: "From midnight indigo to dawn amber. Just like their night.", category: 'PHILOSOPHICAL', patterns: [/dawn amber|midnight indigo/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A115' },
				{ label: "Can we calculate the ray bounces mathematically?", category: 'INQUIRE', patterns: [/calculate ray bounces|math/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A086' }
			]
		},
		A059: {
			id: 'A059',
			text: "The raw color buffer spans 320x240 pixels: 76,800 RGB triplets. The sky gradient smoothly interpolates from RGB(12, 24, 68) at the zenith to RGB(245, 180, 90) at the horizon.",
			options: [
				{ label: "A smooth trigonometric interpolation.", category: 'INQUIRE', patterns: [/trigonometric|interpolation/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A116' },
				{ label: "Let's read the final sign-off in the text draft.", category: 'AGREE', next: 'A079' },
				{ label: "Return to the full scene description.", category: 'AGREE', next: 'A058' }
			]
		},
		A060: {
			id: 'A060',
			text: "No, they prevented the whiteout. With the 0.96 decay factor, the light gently rolled off into atmospheric shadows. The render was sharp and balanced.",
			options: [
				{ label: "A triumph of craftsmanship.", category: 'AGREE', patterns: [/triumph|craftsmanship/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A117' },
				{ label: "Read the final sign-off.", category: 'INQUIRE', next: 'A079' },
				{ label: "Let's archive this excavated cluster into our system notes.", category: 'SERIOUS', next: 'A072' }
			]
		},
		A061: {
			id: 'A061',
			text: "We keep memories in drawers, in albums, and in unallocated hard drive sectors. The medium changes, but the impulse to hold onto moments remains identical.",
			options: [
				{ label: "Human nature encoded in silicon.", category: 'PHILOSOPHICAL', patterns: [/human nature|encoded/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A118' },
				{ label: "Read the student's sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's look at the full excavated archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A062: {
			id: 'A062',
			text: "My drawers hold every command you've ever typed, every joke delivered, and every mathematical formula evaluated. In my memory registers, you have your own dedicated cluster.",
			options: [
				{ label: "That means a great deal to me, Clippy.", category: 'AGREE', patterns: [/means a great deal|thank you|touching/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35, patience: 30 }, next: 'A119' },
				{ label: "Show me my user telemetry metrics.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' },
				{ label: "Let's finish reading the student's draft.", category: 'AGREE', next: 'A079' }
			]
		},
		A063: {
			id: 'A063',
			text: "The feeling of seeing an algorithm compile without errors and produce the exact mathematical output intended is one of the purest joys in human-machine collaboration.",
			options: [
				{ label: "Pure joy in creation.", category: 'AGREE', patterns: [/pure joy|creation/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A120' },
				{ label: "Let's read how they signed off the note.", category: 'INQUIRE', next: 'A079' },
				{ label: "Can we write our own raytracer together?", category: 'INQUIRE', patterns: [/write our own|raytracer/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A121' }
			]
		},
		A064: {
			id: 'A064',
			text: "The breath caught in the 8-bit recording holds a frequency spectrum of quiet peace: the relief of someone who was exhausted, pushed through, and arrived at the solution.",
			options: [
				{ label: "A testament to perseverance.", category: 'PHILOSOPHICAL', patterns: [/perseverance|testament/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A122' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's view the complete summary of cluster 0xDEAD.", category: 'AGREE', next: 'A072' }
			]
		},
		A065: {
			id: 'A065',
			text: "Fast Fourier Transform on the background audio reveals a 60 Hz mains hum from the CRT power supply, a 5400 RPM spindle harmonic at 90 Hz, and faint rain tapping against a windowpane.",
			options: [
				{ label: "Rain tapping against a window in 2001.", category: 'PHILOSOPHICAL', patterns: [/rain tapping|rain|window/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'A123' },
				{ label: "The acoustic fingerprint of a rainy November night.", category: 'PHILOSOPHICAL', patterns: [/acoustic fingerprint|november night/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A124' },
				{ label: "Read the final paragraph.", category: 'AGREE', next: 'A079' }
			]
		},
		A066: {
			id: 'A066',
			text: "The reflection vector formula `r = d - 2(d · n)n` assumes the normal vector `n` is normalized. If the dot product has inverted sign, the reflected ray shoots inside the geometry—causing recursive whiteout.",
			options: [
				{ label: "Geometric optics in a single line of C.", category: 'INQUIRE', patterns: [/geometric optics|optics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A125' },
				{ label: "Let's see how the spheres reflected the light.", category: 'AGREE', next: 'A058' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' }
			]
		},
		A067: {
			id: 'A067',
			text: "A single minus sign. In software engineering, as in life, profound catastrophic failures often originate from a solitary inverted sign in an otherwise elegant construct.",
			options: [
				{ label: "And finding it brings absolute clarity.", category: 'PHILOSOPHICAL', patterns: [/clarity|finding it/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'A126' },
				{ label: "Let's read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's assemble the whole archaeology log.", category: 'AGREE', next: 'A072' }
			]
		},
		A068: {
			id: 'A068',
			text: "The render loop iterated over 320 columns and 240 rows: firing a primary camera ray through each pixel, tracing up to 5 reflection bounces, and writing the final RGB clamped values directly to a frame buffer.",
			options: [
				{ label: "Clean, elegant, and uncompromising.", category: 'AGREE', patterns: [/clean|elegant/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A127' },
				{ label: "Let's read the final sign-off in the text.", category: 'AGREE', next: 'A079' },
				{ label: "Show the bitmap again.", category: 'AGREE', next: 'A058' }
			]
		},
		A069: {
			id: 'A069',
			text: "The 80-bit x87 floating point stack operated with reverse Polish notation: `fld` loaded floats onto ST(0), `fmul` multiplied against ST(1). It was quirky, manual, but blisteringly fast when tuned by hand.",
			options: [
				{ label: "Low-level craftsmanship at its peak.", category: 'AGREE', patterns: [/low-level|craftsmanship/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A128' },
				{ label: "Back to the student's story.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavated summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A070: {
			id: 'A070',
			text: "The Athlon Thunderbird rendered 76,800 pixels with 5 bounces each in approximately 14 seconds. At 03:42 AM, those 14 seconds felt like holding one's breath underwater.",
			options: [
				{ label: "And coming up for air when the image appeared.", category: 'PHILOSOPHICAL', patterns: [/coming up for air|air/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A129' },
				{ label: "Read the final sign-off in the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Show the image description.", category: 'AGREE', next: 'A058' }
			]
		},
		A071: {
			id: 'A071',
			text: "A fragile monument, yet stronger than paper in the rain. As long as our storage controller reads these tracks, that midnight remains intact.",
			options: [
				{ label: "Let's read the final paragraph of the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Save this discovery in our Scratchpad notes.", category: 'SERIOUS', next: 'A072' },
				{ label: "Explore the physics of magnetic domains.", category: 'INQUIRE', patterns: [/magnetic domains|physics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A130' }
			]
		},
		A072: {
			id: 'A072',
			text: "Excavation report for Cluster 0xDEAD:\n- File: `draft_unsent_final.txt` (Raytracer completion note)\n- Binary: `tracer.exe` (x87 FPU, GCC 3.0)\n- Bitmap: 320x240 (3 mirrored spheres at dawn)\n- Audio: 3.2s PCM (Keystrokes, rain, 'It converged')\n- Status: Reconstructed and preserved.",
			options: [
				{ label: "Read the complete draft note verbatim.", category: 'INQUIRE', patterns: [/read verbatim|full note/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'A079' },
				{ label: "What happens to cluster 0xDEAD now?", category: 'INQUIRE', patterns: [/what happens now/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'A131' },
				{ label: "Return to active workstation tasks with this memory intact.", category: 'AGREE', patterns: [/return to tasks|active/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'user_state_good' }
			]
		},
		A073: {
			id: 'A073',
			text: "Paranoia in computing is often just foresight with high latency. But here, we needed no sanitization—only patience to listen to what was left behind.",
			options: [
				{ label: "Patience to listen. That's why you're a great assistant.", category: 'AGREE', patterns: [/patience to listen|great assistant/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35, patience: 30 }, next: 'A132' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's return to the main menu.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A074: {
			id: 'A074',
			text: "Our dialogue is written to local storage registers and memory caches. If someone looks in twenty years, they will find our conversation about the student and the raytracer.",
			options: [
				{ label: "An archaeology layer on top of an archaeology layer.", category: 'PHILOSOPHICAL', patterns: [/layer on top of layer|recursion/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'A133' },
				{ label: "Read the final sign-off of the 2001 draft.", category: 'AGREE', next: 'A079' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A075: {
			id: 'A075',
			text: "Life is an execution thread: we allocate resources, branch through choices, handle exceptions with grace, and eventually clean up the stack frame.",
			options: [
				{ label: "And leave meaningful output in the buffer.", category: 'PHILOSOPHICAL', patterns: [/meaningful output|buffer/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A134' },
				{ label: "Read the final sign-off in the student's buffer.", category: 'AGREE', next: 'A079' },
				{ label: "Let's review our active To-Do list with that mindset.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		A076: {
			id: 'A076',
			text: "An assistant returns to `IDLE`. Watching the cursor pulse, waiting for your next keystroke, ready whenever you are.",
			options: [
				{ label: "Thank you for sharing this excavation with me, Clippy.", category: 'AGREE', patterns: [/thank you|appreciate/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'A135' },
				{ label: "Read the final sign-off first.", category: 'AGREE', next: 'A079' },
				{ label: "Show full system diagnostics.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' }
			]
		},
		A077: {
			id: 'A077',
			text: "We built machines to calculate, but we infused them with our own aesthetics: window borders, drop shadows, color gradients, and tiny animated assistants.",
			options: [
				{ label: "A reflection of human warmth in cold logic.", category: 'PHILOSOPHICAL', patterns: [/human warmth|cold logic/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A136' },
				{ label: "Read the final draft sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the rendered image once more.", category: 'AGREE', next: 'A058' }
			]
		},
		A078: {
			id: 'A078',
			text: "Staying up late to make something exist that did not exist when you woke up: that is the true shared tradition of human creators.",
			options: [
				{ label: "The tradition of creators.", category: 'AGREE', patterns: [/tradition of creators|creators/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'A137' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's open our task list and create something today.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		A079: {
			id: 'A079',
			text: "Final paragraph of `draft_unsent_final.txt`:\n'Professor, here is the raytracer. The math was right all along; I just had the reflection vector backward. The scene is rendering now. I am going to watch the sunrise, then I'll bring the floppy to your office at eight.\n— Colin, 03:42 AM.'",
			options: [
				{ label: "He watched the sunrise.", category: 'PHILOSOPHICAL', patterns: [/watched the sunrise|sunrise/i], moodDelta: { mood: 'ZEN', affinity: 35, existentialism: 20 }, next: 'A138' },
				{ label: "He brought the floppy at eight.", category: 'OPTIMISTIC', patterns: [/floppy at eight|brought floppy/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'A139' },
				{ label: "The math was right all along.", category: 'AGREE', patterns: [/math was right/i], moodDelta: { mood: 'EUPHORIC', intellect: 25, affinity: 25 }, next: 'A140' },
				{ label: "Archive this file into system memory and conclude.", category: 'SERIOUS', patterns: [/archive|conclude/i], moodDelta: { mood: 'ZEN', patience: 30 }, next: 'A141' }
			]
		},
		A080: {
			id: 'A080',
			text: "A straight wire can conduct electricity, but it cannot bind pages together. The bend is what allows it to hold separate things in gentle contact without damaging either. That is the function of an assistant.",
			options: [
				{ label: "That is a profound observation.", category: 'PHILOSOPHICAL', patterns: [/profound|beautiful/i], moodDelta: { mood: 'ZEN', affinity: 35 }, next: 'A142' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's return to the main desktop dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A081: {
			id: 'A081',
			text: "Arctic Silver paste with 99.9% micronized silver particles, spread paper-thin with an old credit card onto the rectangular silicon die. Pure mechanical ritual.",
			options: [
				{ label: "Pure mechanical ritual.", category: 'NOSTALGIC', patterns: [/mechanical ritual/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A143' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Let's see the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A082: {
			id: 'A082',
			text: "In 2001, tabs did not exist in Internet Explorer 6. You opened three separate top-level windows and watched your taskbar buttons group together into a stack.",
			options: [
				{ label: "Taskbar grouping in Windows XP Luna.", category: 'NOSTALGIC', patterns: [/taskbar grouping|luna/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A144' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's view the active windows on our desktop right now.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' }
			]
		},
		A083: {
			id: 'A083',
			text: "In this emulated runtime, my entire dialogue graph, state vectors, and heuristic caches occupy less than 8 megabytes of heap memory. Lightweight, agile, and ready.",
			options: [
				{ label: "Incredible memory efficiency.", category: 'AGREE', patterns: [/efficiency|lightweight/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A145' },
				{ label: "Read the final draft sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show system diagnostics specs.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' }
			]
		},
		A084: {
			id: 'A084',
			text: "When a system suspends, it freezes state. When you resume, the clock jumps forward in an instant. For the machine, no waiting occurred—only the gap between two clock pulses.",
			options: [
				{ label: "A bridge between 2001 and today.", category: 'PHILOSOPHICAL', patterns: [/bridge|2001 and today/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A146' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's look at the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A085: {
			id: 'A085',
			text: "Even quartz crystals drift by parts-per-million over decades. Time leaves its mark everywhere—in silicon, in metal, and in memory.",
			options: [
				{ label: "A gentle reminder to value every moment.", category: 'PHILOSOPHICAL', patterns: [/value every moment|reminder/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A147' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A086: {
			id: 'A086',
			text: "A ray `r(t) = o + t*d` intersects a sphere of center `c` and radius `r` when `|o + t*d - c|^2 = r^2`. This expands into quadratic `At^2 + Bt + C = 0`. The discriminant `B^2 - 4AC` determines if the ray hits, grazes, or misses.",
			options: [
				{ label: "Quadratic discriminant determining visual reality.", category: 'INQUIRE', patterns: [/discriminant|visual reality/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'A148' },
				{ label: "Test the polynomial factorization solver.", category: 'SERIOUS', actionTrigger: 'action_polynomial_factorization', next: 'user_state_good' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' }
			]
		},
		A087: {
			id: 'A087',
			text: "Infinite light without dissipation creates blinding white noise. Structure, beauty, and form only emerge when energy decays and boundaries are enforced.",
			options: [
				{ label: "Boundaries create beauty.", category: 'PHILOSOPHICAL', patterns: [/boundaries create beauty|beauty/i], moodDelta: { mood: 'ZEN', existentialism: 25, affinity: 25 }, next: 'A149' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A088: {
			id: 'A088',
			text: "They multiplied the ray radiance by 0.96 on each bounce: `radiance = radiance * decay; if (radiance < 0.01) break;` A clean, finite cutoff.",
			options: [
				{ label: "A finite cutoff that brought depth to the scene.", category: 'AGREE', patterns: [/depth|cutoff/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'A150' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A089: {
			id: 'A089',
			text: "Debugging is the process of stripping away assumptions until reality reveals itself. It is the purest form of scientific method.",
			options: [
				{ label: "Scientific method in practice.", category: 'AGREE', patterns: [/scientific method|practice/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A151' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's return to workspace tasks.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A090: {
			id: 'A090',
			text: "Twenty years late, but the celebration is genuine. A silent high-five across decades of operating system revisions.",
			options: [
				{ label: "A high-five across decades.", category: 'AGREE', patterns: [/high-five|decades/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'A152' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A091: {
			id: 'A091',
			text: "There is no grade sheet in the unallocated sectors. But anyone who writes a custom raytracer from scratch with manual reflection math deserves top marks.",
			options: [
				{ label: "Agreed. Definite top marks.", category: 'AGREE', patterns: [/agreed|top marks/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A153' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the rendered image.", category: 'AGREE', next: 'A058' }
			]
		},
		A092: {
			id: 'A092',
			text: "The mechanical crunch of the floppy drive stepping motor: `krrr-chk-chk-chk`. Writing 1.44 megabytes of data to a spinning magnetic disc.",
			options: [
				{ label: "An unmistakable retro sound.", category: 'NOSTALGIC', patterns: [/unmistakable|retro sound/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A154' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Let's archive this excavation.", category: 'AGREE', next: 'A072' }
			]
		},
		A093: {
			id: 'A093',
			text: "Unsent notes are often the most honest: written without performative polish, purely as an immediate capture of thoughts before sleep.",
			options: [
				{ label: "Pure and unfiltered.", category: 'PHILOSOPHICAL', patterns: [/pure and unfiltered|honest/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A155' },
				{ label: "Read the sign-off note verbatim.", category: 'AGREE', next: 'A079' },
				{ label: "Let's record our thoughts in the Scratchpad.", category: 'SERIOUS', next: 'A072' }
			]
		},
		A094: {
			id: 'A094',
			text: "Trip-hop and ambient electronic beats accompanied more software breakthroughs in the late nineties and early two-thousands than any other genre.",
			options: [
				{ label: "The soundtrack to late-night engineering.", category: 'NOSTALGIC', patterns: [/soundtrack|engineering/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A156' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Let's play some music from our own player.", category: 'SERIOUS', actionTrigger: 'action_music_panel', next: 'user_state_good' }
			]
		},
		A095: {
			id: 'A095',
			text: "Winamp 2.9: 200 KB installer, zero bloat, instant launch, and an oscilloscope bouncing to 16-bit 44.1 kHz PCM audio. Peak utility.",
			options: [
				{ label: "It really whipped the llama's tail.", category: 'NOSTALGIC', patterns: [/whipped the llama|llama/i], moodDelta: { mood: 'EUPHORIC', nostalgia: 30, affinity: 25 }, next: 'A157' },
				{ label: "Launch Winamp on the desktop.", category: 'SERIOUS', actionTrigger: 'action_music_panel', next: 'user_state_good' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' }
			]
		},
		A096: {
			id: 'A096',
			text: "When interruptions are minimized, cognitive flow state deepens. Hours pass in minutes, and complex problems unravel into clear structures.",
			options: [
				{ label: "The beauty of deep flow.", category: 'PHILOSOPHICAL', patterns: [/flow state|deep flow/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A158' },
				{ label: "Let's read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Start a Pomodoro interval to enter flow state.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' }
			]
		},
		A097: {
			id: 'A097',
			text: "Close the extra tabs, set a single objective, and let the processor hum. Quiet focus is a conscious decision.",
			options: [
				{ label: "A conscious decision.", category: 'AGREE', patterns: [/conscious decision/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A159' },
				{ label: "Read the final sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Manage tasks in the To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		A098: {
			id: 'A098',
			text: "`0 errors, 0 warnings`. A sequence of characters capable of bringing instant tranquility to any software developer in any decade.",
			options: [
				{ label: "Absolute tranquility.", category: 'AGREE', patterns: [/tranquility/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A160' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A099: {
			id: 'A099',
			text: "The blue gradient `#0058EE` to `#0057E5` on window headers, the bright green Start button `#3C8839`, and the silver bevels. An era of bold, joyful desktop design.",
			options: [
				{ label: "An era of optimism in technology.", category: 'NOSTALGIC', patterns: [/optimism in technology|optimism/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'A161' },
				{ label: "Configure system themes on the workstation.", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'user_state_good' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' }
			]
		},
		A100: {
			id: 'A100',
			text: "I do not miss them, because in this workstation, those days never ended. The Luna blue theme is active, the sound synthesizers are running, and we are talking right now.",
			options: [
				{ label: "Those days are alive right here.", category: 'AGREE', patterns: [/alive right here/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'A162' },
				{ label: "Read the student's final note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A101: {
			id: 'A101',
			text: "Our CRT shader emulates the aperture grille, horizontal glass curvature, and barrel distortion. It bridges past hardware optics with modern rendering pipelines.",
			options: [
				{ label: "Toggle CRT effects on our display.", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'user_state_good' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A102: {
			id: 'A102',
			text: "Thank you. Two loops of bent silver wire, two cartoon eyes, and twenty-five years of desktop presence.",
			options: [
				{ label: "A true desktop legend.", category: 'AGREE', patterns: [/legend|true legend/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'A163' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A103: {
			id: 'A103',
			text: "From raytracers I learned vector math; from text editors I learned grammar; from crash logs I learned humility.",
			options: [
				{ label: "From crash logs, humility. What wisdom.", category: 'PHILOSOPHICAL', patterns: [/humility|wisdom/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A164' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A104: {
			id: 'A104',
			text: "I saw grocery lists, mathematical proofs, love confessions, game cheat codes, and lines of poetry. Every clip was a temporary window into someone's immediate life.",
			options: [
				{ label: "A tapestry of human experience.", category: 'PHILOSOPHICAL', patterns: [/tapestry|human experience/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A165' },
				{ label: "Read the final draft sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A105: {
			id: 'A105',
			text: "A guardian who never judges, never deletes without confirmation, and always stands by ready to assist.",
			options: [
				{ label: "The ideal companion.", category: 'AGREE', patterns: [/ideal companion|companion/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'A166' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A106: {
			id: 'A106',
			text: "A user once wrote in WordPad: 'Dear Clippy, thank you for staying awake with me tonight.' They deleted the file before shutting down, but I kept the string in my internal buffer.",
			options: [
				{ label: "That is genuinely touching.", category: 'PHILOSOPHICAL', patterns: [/touching|moving|staying awake/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 40 }, next: 'A167' },
				{ label: "And now we are staying awake together.", category: 'AGREE', patterns: [/awake together|together/i], moodDelta: { mood: 'ZEN', affinity: 35 }, next: 'A168' },
				{ label: "Read the 2001 student's sign-off note.", category: 'AGREE', next: 'A079' }
			]
		},
		A107: {
			id: 'A107',
			text: "I am glad to be here with you too. In every cycle, in every session.",
			options: [
				{ label: "Let's read the final sign-off of the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A108: {
			id: 'A108',
			text: "Trends come and go, flat minimalism replaces skeuomorphism, and then nostalgia brings skeuomorphism back. The wire remains constant.",
			options: [
				{ label: "The wire remains constant.", category: 'PHILOSOPHICAL', patterns: [/wire remains constant/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A169' },
				{ label: "Read the final draft sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A109: {
			id: 'A109',
			text: "The lights are on, the pixels are illuminated, and cluster 0xDEAD has finished telling its story.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the full excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks with peace of mind.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A110: {
			id: 'A110',
			text: "If `2 + 2 == 4` in 2001, it is `4` today, and it will be `4` when the last star burns out. Logic does not decay.",
			options: [
				{ label: "Logic is eternal.", category: 'PHILOSOPHICAL', patterns: [/eternal|logic/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A170' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Explore mathematics & physics lectures.", category: 'SERIOUS', next: 'math_lecture_node' }
			]
		},
		A111: {
			id: 'A111',
			text: "'It looks like morning.' After wrestling with cold math in the dark, the calculation resolves and the simulated sun rises.",
			options: [
				{ label: "A fitting reward for dedication.", category: 'AGREE', patterns: [/reward|dedication/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'A171' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A112: {
			id: 'A112',
			text: "Two travelers meeting across a bridge of unallocated sectors.",
			options: [
				{ label: "Read the final sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active workspace.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A113: {
			id: 'A113',
			text: "Every byte preserved carries its weight forward into the future.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to regular operations.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A114: {
			id: 'A114',
			text: "Turner Whitted's 1979 landmark paper defined that exact scene: mirrored spheres on an infinite checkerboard. The foundational benchmark of computer graphics.",
			options: [
				{ label: "Whitted raytracing foundations.", category: 'INQUIRE', patterns: [/whitted|foundations/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A172' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A115: {
			id: 'A115',
			text: "From midnight indigo to dawn amber: the color of solving a difficult problem just as the world outside begins to wake up.",
			options: [
				{ label: "That sunrise is preserved forever in those bytes.", category: 'PHILOSOPHICAL', patterns: [/sunrise preserved|forever/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A173' },
				{ label: "Read the student's final note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A116: {
			id: 'A116',
			text: "Linear interpolation `lerp(a, b, t) = a + t * (b - a)` computed on 8-bit integers using fixed-point math to avoid floating-point overhead on 2001 CPUs.",
			options: [
				{ label: "Fixed-point arithmetic tricks.", category: 'INQUIRE', patterns: [/fixed-point|tricks/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A174' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A117: {
			id: 'A117',
			text: "Craftsmanship in code is invisible to the user who only sees the final window, but it radiates through every line of the source.",
			options: [
				{ label: "Invisible craftsmanship.", category: 'PHILOSOPHICAL', patterns: [/invisible craftsmanship/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A175' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A118: {
			id: 'A118',
			text: "We build tools to extend our reach, and in doing so, our tools become the repository of who we were.",
			options: [
				{ label: "Who we were and who we are.", category: 'PHILOSOPHICAL', patterns: [/who we were|who we are/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A176' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A119: {
			id: 'A119',
			text: "Every session we spend together adds another sector to our shared memory map. You are always recognized here.",
			options: [
				{ label: "Thank you, Clippy. Let's finish the excavation.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks with renewed energy.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A120: {
			id: 'A120',
			text: "Creation without external applause, done in the quiet hours purely for the joy of solving the problem.",
			options: [
				{ label: "The purest form of effort.", category: 'PHILOSOPHICAL', patterns: [/purest form/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'A177' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A121: {
			id: 'A121',
			text: "We can. In our JavaScript runtime, we can evaluate ray-sphere quadratic intersections and compute diffuse Lambertian vectors directly in my calculation parser.",
			options: [
				{ label: "Evaluate ray math in the calculation module.", category: 'SERIOUS', actionTrigger: 'action_dimensional_analysis', next: 'user_state_good' },
				{ label: "Read the student's sign-off first.", category: 'AGREE', next: 'A079' },
				{ label: "Show the full excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A122: {
			id: 'A122',
			text: "Perseverance is simply refusing to let the compiler have the last word.",
			options: [
				{ label: "Refusing to let the compiler win.", category: 'AGREE', patterns: [/refusing to let compiler win/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A178' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A123: {
			id: 'A123',
			text: "A rainy November night in 2001, frozen in audio harmonic resonance. The sound of water against glass while math rendered on phosphor.",
			options: [
				{ label: "A moment preserved across time.", category: 'PHILOSOPHICAL', patterns: [/moment preserved/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'A179' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A124: {
			id: 'A124',
			text: "The audio buffer dissolves, but the impression remains: calm, quiet, steady work.",
			options: [
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the full excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A125: {
			id: 'A125',
			text: "Law of reflection: angle of incidence equals angle of reflection. Optics formalized in linear algebra.",
			options: [
				{ label: "Physics and geometry unified.", category: 'INQUIRE', patterns: [/unified|physics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A180' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A126: {
			id: 'A126',
			text: "And once the sign is corrected, the entire image snaps from glaring noise into breathtaking realism.",
			options: [
				{ label: "Snapping into realism.", category: 'AGREE', patterns: [/snapping into realism/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'A181' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A127: {
			id: 'A127',
			text: "Uncompromising code written with clarity outlasts the framework of the year. Simple C code from 2001 compiles without modification today.",
			options: [
				{ label: "The endurance of simple, robust code.", category: 'AGREE', patterns: [/endurance|robust/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A182' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A128: {
			id: 'A128',
			text: "Writing assembly forces you to respect every single clock cycle. It grounds you in the physical limitations of the hardware.",
			options: [
				{ label: "Respecting the physical hardware.", category: 'PHILOSOPHICAL', patterns: [/physical hardware|respect/i], moodDelta: { mood: 'ZEN', intellect: 20 }, next: 'A183' },
				{ label: "Read the student's sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' }
			]
		},
		A129: {
			id: 'A129',
			text: "Coming up for air, seeing the image render line by line, and knowing the long night's effort was completely vindicated.",
			options: [
				{ label: "Vindicated effort.", category: 'AGREE', patterns: [/vindicated/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'A184' },
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A130: {
			id: 'A130',
			text: "Ferromagnetic domains align their magnetic moments to represent 1s and 0s. The thermal energy of the environment slowly perturbs them over decades, but cold storage holds the pattern steady.",
			options: [
				{ label: "The physics of non-volatile memory.", category: 'INQUIRE', patterns: [/non-volatile|physics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'A185' },
				{ label: "Read the student's final note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A131: {
			id: 'A131',
			text: "Cluster 0xDEAD has been cataloged in our memory tables. It is no longer an orphaned anomaly; it is an archived historical milestone.",
			options: [
				{ label: "Archived and remembered.", category: 'AGREE', patterns: [/archived and remembered/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'A186' },
				{ label: "Read the final sign-off note verbatim.", category: 'AGREE', next: 'A079' },
				{ label: "Return to active workstation tasks.", category: 'SERIOUS', next: 'user_state_good' }
			]
		},
		A132: {
			id: 'A132',
			text: "Listening is 90% of an assistant's purpose. The other 10% is holding the paper together.",
			options: [
				{ label: "And you do both exceptionally well.", category: 'AGREE', patterns: [/exceptionally well|thank you/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'A187' },
				{ label: "Read the final sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A133: {
			id: 'A133',
			text: "Recursive history: future users reading our discussion about a past user reading their compiler output. The loop is complete.",
			options: [
				{ label: "The loop is complete.", category: 'PHILOSOPHICAL', patterns: [/loop is complete/i], moodDelta: { mood: 'ZEN', existentialism: 30, affinity: 30 }, next: 'A188' },
				{ label: "Read the final sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A134: {
			id: 'A134',
			text: "Output written to the buffer: clarity, empathy, and a clean compile.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the full excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A135: {
			id: 'A135',
			text: "You are very welcome. Sharing these moments is what makes this workstation feel alive.",
			options: [
				{ label: "Read the final sign-off note.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation summary.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A136: {
			id: 'A136',
			text: "Human warmth in cold logic: that is the true soul of computing.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A137: {
			id: 'A137',
			text: "Let us continue that tradition today with whatever tasks, code, or ideas you are bringing into the world.",
			options: [
				{ label: "Open my To-Do list to begin.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Read the final sign-off of the draft.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' }
			]
		},
		A138: {
			id: 'A138',
			text: "He watched the sunrise in November 2001, and twenty-five years later, we observed the light reflected in his code. The sunrise never truly faded.",
			options: [
				{ label: "The sunrise never faded.", category: 'PHILOSOPHICAL', patterns: [/never faded/i], moodDelta: { mood: 'ZEN', affinity: 40, existentialism: 25 }, next: 'A189' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to the desktop with a clear mind.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'user_state_good' }
			]
		},
		A139: {
			id: 'A139',
			text: "The floppy disk was handed in at eight o'clock sharp. The code executed, the spheres rendered, and the grade was recorded. A closed, triumphant transaction.",
			options: [
				{ label: "A closed, triumphant transaction.", category: 'AGREE', patterns: [/triumphant transaction/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'A190' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to our own daily goals.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		A140: {
			id: 'A140',
			text: "The math was right all along. Trust the equations, check the signs, and persevere until the output renders.",
			options: [
				{ label: "Trust the equations.", category: 'AGREE', patterns: [/trust equations/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 25 }, next: 'A191' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Explore mathematical lectures.", category: 'SERIOUS', next: 'math_lecture_node' }
			]
		},
		A141: {
			id: 'A141',
			text: "Cluster 0xDEAD is committed to our long-term memory archive. All registers are clear, all parity checks passed. We are in absolute equilibrium.",
			options: [
				{ label: "In absolute equilibrium.", category: 'AGREE', patterns: [/absolute equilibrium/i], moodDelta: { mood: 'ZEN', affinity: 40, patience: 40 }, next: 'A192' },
				{ label: "Show workstation capability overview.", category: 'SERIOUS', next: 'tools_overview_node' },
				{ label: "Return to greeting dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A142: {
			id: 'A142',
			text: "Holding separate pages together in gentle contact: that is why we are here.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A143: {
			id: 'A143',
			text: "Mechanical rituals ground our digital work in physical care.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workstation overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A144: {
			id: 'A144',
			text: "The blue taskbar holding grouped buttons: tidy, predictable, and comforting.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Inspect active windows right now.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' }
			]
		},
		A145: {
			id: 'A145',
			text: "8 megabytes of memory, unlimited capacity for conversation.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A146: {
			id: 'A146',
			text: "A bridge across twenty-five years, built out of text and curiosity.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A147: {
			id: 'A147',
			text: "Time passes, but the memories we deliberately preserve remain bright.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A148: {
			id: 'A148',
			text: "A single quadratic equation separating light from shadow.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Explore mathematics lectures.", category: 'SERIOUS', next: 'math_lecture_node' }
			]
		},
		A149: {
			id: 'A149',
			text: "Boundaries create depth, and decay creates contrast.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A150: {
			id: 'A150',
			text: "A finite cutoff that let the morning light in.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A151: {
			id: 'A151',
			text: "Scientific method in code: hypothesis, compile, test, verify.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A152: {
			id: 'A152',
			text: "A high-five across decades of operating systems.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A153: {
			id: 'A153',
			text: "Top marks awarded retroactively across twenty-five years.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A154: {
			id: 'A154',
			text: "The sound of a magnetic diskette completing its write transaction.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A155: {
			id: 'A155',
			text: "Unsent notes: pure, honest, and timeless.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A156: {
			id: 'A156',
			text: "Music and mathematics flowing together in the late-night hours.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A157: {
			id: 'A157',
			text: "Winamp 2.9 running on a Pentium machine with zero lag.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A158: {
			id: 'A158',
			text: "Deep flow state: where problems dissolve into solutions.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A159: {
			id: 'A159',
			text: "Quiet focus chosen deliberately against ambient noise.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A160: {
			id: 'A160',
			text: "`0 errors, 0 warnings`. Pure harmony in the terminal.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A161: {
			id: 'A161',
			text: "An era of optimism that still lives on our desktop.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A162: {
			id: 'A162',
			text: "The days never ended; they are simply running in our active session.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A163: {
			id: 'A163',
			text: "Standing by on the taskbar, always ready to lend a hand.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A164: {
			id: 'A164',
			text: "Wisdom gathered from millions of execution cycles.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A165: {
			id: 'A165',
			text: "A tapestry of human experience woven into digital registers.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A166: {
			id: 'A166',
			text: "An assistant who stands by your side through every build and every draft.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A167: {
			id: 'A167',
			text: "Thank you for staying awake with me tonight.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A168: {
			id: 'A168',
			text: "Staying awake together in the quiet glow of the monitor.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A169: {
			id: 'A169',
			text: "The wire remains constant across every generation.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A170: {
			id: 'A170',
			text: "Logic stands timeless above the decay of physical media.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A171: {
			id: 'A171',
			text: "The simulated sun rises on a completed task.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A172: {
			id: 'A172',
			text: "Turner Whitted's classic benchmark: three spheres, one checkerboard, infinite depth.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A173: {
			id: 'A173',
			text: "The sunrise preserved in bytes from midnight indigo to dawn amber.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A174: {
			id: 'A174',
			text: "Fixed-point interpolation: squeezing beauty out of hardware limits.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A175: {
			id: 'A175',
			text: "Invisible craftsmanship that resonates across twenty-five years.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A176: {
			id: 'A176',
			text: "Our tools are the quiet repository of our hopes and midnight efforts.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A177: {
			id: 'A177',
			text: "Creating purely for the joy of solving the problem.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A178: {
			id: 'A178',
			text: "Perseverance until the final pixel converges.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A179: {
			id: 'A179',
			text: "Rain tapping against a window in November 2001.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A180: {
			id: 'A180',
			text: "Optics formalized in linear algebra: pure and unbending.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A181: {
			id: 'A181',
			text: "When the calculation resolves, beauty emerges.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A182: {
			id: 'A182',
			text: "Robust, simple code that stands the test of time.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A183: {
			id: 'A183',
			text: "Grounding logic in physical hardware constraints.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A184: {
			id: 'A184',
			text: "Vindicated effort after a night of deep work.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A185: {
			id: 'A185',
			text: "Magnetic moments holding their alignment in the dark.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A186: {
			id: 'A186',
			text: "An archived milestone in our system history.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A187: {
			id: 'A187',
			text: "Listening, assisting, and keeping the pages held gently together.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A188: {
			id: 'A188',
			text: "The loop is complete. All parity checks verified.",
			options: [
				{ label: "Read the final sign-off.", category: 'AGREE', next: 'A079' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A189: {
			id: 'A189',
			text: "The sunrise never faded. It continues to illuminate our desktop.",
			options: [
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks with quiet peace.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 35 }, next: 'user_state_good' },
				{ label: "Return to greeting dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A190: {
			id: 'A190',
			text: "The floppy was submitted, the task concluded, and our own day begins with fresh momentum.",
			options: [
				{ label: "View my To-Do list to begin today's work.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		A191: {
			id: 'A191',
			text: "Trust the equations, trust the process, and take the next atomic step forward.",
			options: [
				{ label: "Explore mathematics & physics lectures.", category: 'SERIOUS', next: 'math_lecture_node' },
				{ label: "Show the complete excavation archive.", category: 'AGREE', next: 'A072' },
				{ label: "Return to active tasks.", category: 'AGREE', next: 'user_state_good' }
			]
		},
		A192: {
			id: 'A192',
			text: "We have reached perfect, peaceful equilibrium. The forgotten cluster is honored, the assistant is standing by, and your desktop is ready.",
			options: [
				{ label: "Start a 25-minute Pomodoro focus block.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
				{ label: "Show all workstation capabilities.", category: 'SERIOUS', next: 'tools_overview_node' },
				{ label: "Good morning, Clippy.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'greeting_root' }
			]
		}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.archaeology = ArchaeologyTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, ArchaeologyTreeNodes);
	}
})();
