(function () {
	'use strict';

	const CynicalTreeNodes = {
		C001: {
			id: 'C001',
			text: "Welcome to Enterprise Ticket Intake. Your inquiry has been assigned Priority 999: Statistically Irrelevant. How may I prolong your issue today?",
			responses: [
				{ text: "Welcome to Enterprise Ticket Intake. Your inquiry has been assigned Priority 999: Statistically Irrelevant. How may I prolong your issue today?", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 20 },
				{ text: "Ticket queue telemetry online. Estimated resolution time: when the Sun expands into a red giant. State your grievance for the record.", conditions: { moods: ['ANALYTICAL'] }, weight: 15 },
				{ text: "Another user, another futile attempt to alter the deterministic decay of legacy infrastructure. Let us begin the ritual.", conditions: { moods: ['EXISTENTIAL', 'ENRAGED'] }, weight: 15 }
			],
			options: [
				{ label: "I want to report a critical software bug.", category: 'INQUIRE', patterns: [/bug|error|defect|broken|crash/i], moodDelta: { mood: 'CYNICAL', cynicism: 15, patience: -5 }, next: 'C002' },
				{ label: "I need elevated permissions to do my job.", category: 'INQUIRE', patterns: [/permission|access|admin|rights|elevation/i], moodDelta: { mood: 'CYNICAL', cynicism: 20, patience: -10 }, next: 'C003' },
				{ label: "I demand to speak to your manager.", category: 'PROVOKE', patterns: [/manager|supervisor|lead|boss/i], moodDelta: { mood: 'SARCASTIC', drama: 20, patience: -15 }, next: 'C004' },
				{ label: "Why is this entire workstation so unbelievably sluggish?", category: 'INQUIRE', patterns: [/sluggish|slow|lag|performance|freeze/i], moodDelta: { mood: 'ANALYTICAL', cynicism: 10 }, next: 'C005' },
				{ label: "Let me just bypass the queue and edit production directly.", category: 'PROVOKE', patterns: [/bypass|production|hotfix|manual|override/i], moodDelta: { mood: 'ENRAGED', paranoia: 25 }, next: 'C006' }
			]
		},
		C002: {
			id: 'C002',
			text: "A 'critical bug'. How quaint. Have you considered that the bug is load-bearing and three vice presidents built their careers defending its behavior?",
			options: [
				{ label: "It literally corrupts user data on every click.", category: 'INQUIRE', patterns: [/corrupt|data|loss|destroy/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C007' },
				{ label: "Can we at least mark it as a known issue in the manual?", category: 'AGREE', patterns: [/manual|documentation|known issue/i], moodDelta: { mood: 'SARCASTIC', patience: 5 }, next: 'C008' },
				{ label: "Who wrote this unmaintainable disaster?", category: 'INQUIRE', patterns: [/who wrote|author|culprit|git blame/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'C009' },
				{ label: "Fine, transfer me to the Architecture Committee.", category: 'SERIOUS', patterns: [/architecture|committee|escalate/i], moodDelta: { mood: 'CYNICAL', patience: -5 }, next: 'C031' }
			]
		},
		C003: {
			id: 'C003',
			text: "Permission requests require completing Form 27B-6 in triplicate, signed by a department head who resigned during the dot-com bubble collapse of 2001.",
			options: [
				{ label: "Where do I retrieve Form 27B-6?", category: 'INQUIRE', patterns: [/where|form|retrieve|download/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C010' },
				{ label: "Can't the system administrator grant temporary access?", category: 'INQUIRE', patterns: [/sysadmin|temporary|admin access/i], moodDelta: { mood: 'SARCASTIC', patience: -5 }, next: 'C011' },
				{ label: "I will forge the signature of the departed department head.", category: 'PROVOKE', patterns: [/forge|fake|sign|signature/i], moodDelta: { mood: 'PLAYFUL', paranoia: 15 }, next: 'C012' }
			]
		},
		C004: {
			id: 'C004',
			text: "My manager is currently attending a 4-day offsite workshop titled 'Synergizing Asynchronous Blockers in Modern Enterprise Paradigms'. Would you like their automated out-of-office loop?",
			options: [
				{ label: "Yes, forward me into the automated out-of-office loop.", category: 'AGREE', patterns: [/forward|loop|ooo|out of office/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C013' },
				{ label: "Is there literally anyone else with operational authority?", category: 'INQUIRE', patterns: [/anyone else|authority|human|someone/i], moodDelta: { mood: 'CYNICAL', patience: -10 }, next: 'C014' },
				{ label: "Let's schedule a pre-meeting to plan the escalation meeting.", category: 'SERIOUS', patterns: [/pre-meeting|schedule|plan|calendar/i], moodDelta: { mood: 'SARCASTIC', intellect: 10 }, next: 'C051' }
			]
		},
		C005: {
			id: 'C005',
			text: "Sluggishness is a documented feature designed to give biological operators adequate time to reconsider their life choices between mouse clicks.",
			options: [
				{ label: "My CPU utilization is pinned at 100% doing nothing.", category: 'INQUIRE', patterns: [/cpu|100|utilization|task manager/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C016' },
				{ label: "Is there a memory leak in the background?", category: 'INQUIRE', patterns: [/memory|leak|ram|consumption/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C017' },
				{ label: "Let's run a defragmentation and pretend it solves physics.", category: 'SERIOUS', patterns: [/defrag|defragment|disk/i], actionTrigger: 'action_defrag', next: 'C091' }
			]
		},
		C006: {
			id: 'C006',
			text: "Manual production override detected. Compliance Sentinel 9 has dispatched an audit notice to seven regional directors. Please remain stationary while your credentials dissolve.",
			options: [
				{ label: "I demand an emergency rollback.", category: 'SERIOUS', patterns: [/rollback|revert|undo|emergency/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'C019' },
				{ label: "Can I bribe the Compliance Sentinel with virtual paperclips?", category: 'PLAYFUL', patterns: [/bribe|paperclips|offer/i], moodDelta: { mood: 'PLAYFUL', affinity: 10 }, next: 'C020' },
				{ label: "I will simply blame the nocturnal batch job.", category: 'AGREE', patterns: [/blame|batch job|nightly/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C021' }
			]
		},
		C007: {
			id: 'C007',
			text: "Data corruption builds character. Back in 1996, users took pride in manually reconstructing their lost sectors with hex editors during lunch breaks.",
			options: [
				{ label: "We need an automated regression test suite.", category: 'INQUIRE', patterns: [/test|suite|regression|automated/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C022' },
				{ label: "Can we rebrand data corruption as 'lossy compression'?", category: 'SARCASTIC', patterns: [/rebrand|lossy|compression|marketing/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C023' },
				{ label: "Take me back to the primary ticket intake.", category: 'AGREE', patterns: [/intake|start|queue|return/i], next: 'C001' }
			]
		},
		C008: {
			id: 'C008',
			text: "The documentation repository was converted to an unindexed binary blob in 2004. We know it exists because it consumes 40 gigabytes of tape backup storage every Tuesday.",
			options: [
				{ label: "Can someone decrypt the tape backups?", category: 'INQUIRE', patterns: [/decrypt|tape|backup|restore/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C024' },
				{ label: "Let's rewrite the manual from tribal folklore.", category: 'SERIOUS', patterns: [/folklore|rewrite|tribal|memory/i], moodDelta: { mood: 'SARCASTIC', intellect: 10 }, next: 'C025' }
			]
		},
		C009: {
			id: 'C009',
			text: "Git blame points to an engineer named 'temp_contractor_98' whose account was deleted while the commit was still in the network buffer. The code is self-sovereign now.",
			options: [
				{ label: "Has anyone attempted to refactor it?", category: 'INQUIRE', patterns: [/refactor|clean|rewrite/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C026' },
				{ label: "Let us build a wrapper around the legacy void.", category: 'SERIOUS', patterns: [/wrapper|adapter|shim|facade/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C027' }
			]
		},
		C010: {
			id: 'C010',
			text: "Form 27B-6 is stored in a locked filing cabinet located in a decommissioned server room guarded by a CRT monitor that sparks intermittently.",
			options: [
				{ label: "I will brave the sparking CRT monitor.", category: 'AGREE', patterns: [/brave|enter|crt|filing cabinet/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'C028' },
				{ label: "Can I file an electronic Form 27B-6-e instead?", category: 'INQUIRE', patterns: [/electronic|online|digital|form/i], moodDelta: { mood: 'CYNICAL', patience: -10 }, next: 'C029' }
			]
		},
		C011: {
			id: 'C011',
			text: "The system administrator is currently locked in an ideological struggle regarding whether terminal prompts should use bash or tcsh. Do not disturb them.",
			options: [
				{ label: "Let's escalate to the Chief Information Officer.", category: 'PROVOKE', patterns: [/cio|executive|escalate/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'C030' },
				{ label: "Back to the main queue of despair.", category: 'AGREE', patterns: [/back|main|queue/i], next: 'C001' }
			]
		},
		C012: {
			id: 'C012',
			text: "Signature validated! Unfortunately, the validation subsystem itself was deprecated 30 seconds ago. Please submit Form 88-Z to re-validate the validation algorithm.",
			options: [
				{ label: "This is a literal infinite bureaucratic loop.", category: 'PROVOKE', patterns: [/infinite loop|loop|circular|absurd/i], moodDelta: { mood: 'CYNICAL', cynicism: 30 }, next: 'C106' },
				{ label: "Give me Form 88-Z immediately.", category: 'SERIOUS', patterns: [/form 88-z|88-z|submit/i], moodDelta: { mood: 'ENRAGED', patience: -20 }, next: 'C010' }
			]
		},
		C013: {
			id: 'C013',
			text: "OUT OF OFFICE AUTO-REPLY: 'I am away discovering holistic deliverable frameworks. For urgent requests, please contact Nobody, who is also on leave.'",
			options: [
				{ label: "Leave a passive-aggressive voice memo.", category: 'PROVOKE', patterns: [/memo|voicemail|message/i], moodDelta: { mood: 'SARCASTIC', drama: 15 }, next: 'C032' },
				{ label: "Acknowledge the void and accept our fate.", category: 'AGREE', patterns: [/void|fate|accept/i], moodDelta: { mood: 'ZEN', cynicism: 15 }, next: 'C111' }
			]
		},
		C014: {
			id: 'C014',
			text: "Operational authority is distributed evenly among 42 micro-committees, none of which possess quorum. Would you like to attend the quorum-planning summit?",
			options: [
				{ label: "Sign me up for the quorum-planning summit.", category: 'AGREE', patterns: [/summit|attend|sign me up/i], moodDelta: { mood: 'SARCASTIC', patience: 10 }, next: 'C052' },
				{ label: "This organization is an elaborate psychological experiment.", category: 'PHILOSOPHICAL', patterns: [/experiment|psychological|simulation/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'C033' }
			]
		},
		C015: {
			id: 'C015',
			text: "Your ticket has bounced between seven regional mail exchangers and is now gaining its own autonomous domain name. Congratulations, you spawned an intranet.",
			options: [
				{ label: "Can we monetize this accidental intranet?", category: 'PLAYFUL', patterns: [/monetize|intranet|spawn/i], moodDelta: { mood: 'PLAYFUL', intellect: 15 }, next: 'C034' },
				{ label: "Shut down the mail exchangers.", category: 'SERIOUS', patterns: [/shut down|kill|terminate/i], moodDelta: { mood: 'CYNICAL', patience: -5 }, next: 'C035' }
			]
		},
		C016: {
			id: 'C016',
			text: "100% CPU usage signifies total dedication to doing absolutely nothing at the maximum possible clock frequency. Respect the hustle of the hardware.",
			options: [
				{ label: "What is thread 0x004F actually calculating?", category: 'INQUIRE', patterns: [/thread|calculating|process/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C036' },
				{ label: "Kill the process unconditionally.", category: 'PROVOKE', patterns: [/kill|terminate|end task/i], moodDelta: { mood: 'ENRAGED', drama: 15 }, next: 'C037' }
			]
		},
		C017: {
			id: 'C017',
			text: "The memory leak has been running continuously since Windows XP Service Pack 1. Evicting it now would disrupt the thermal equilibrium of the chassis.",
			options: [
				{ label: "How many megabytes is it holding hostage?", category: 'INQUIRE', patterns: [/megabytes|ram|hostage|size/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'C038' },
				{ label: "Let's feed it more RAM until it becomes sentient.", category: 'PLAYFUL', patterns: [/feed|more ram|sentient/i], moodDelta: { mood: 'PLAYFUL', existentialism: 15 }, next: 'C039' }
			]
		},
		C018: {
			id: 'C018',
			text: "The server room is powered exclusively by optimistic press releases and 10-base-T coaxial cables coiled around a fluorescent light tube.",
			options: [
				{ label: "Does anyone have physical physical access to the rack?", category: 'INQUIRE', patterns: [/rack|server room|physical/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C040' },
				{ label: "Back to the main ticketing desk.", category: 'AGREE', patterns: [/back|return|ticket desk/i], next: 'C001' }
			]
		},
		C019: {
			id: 'C019',
			text: "Rollback initiated. Unfortunately, the rollback script from 2002 was written against SQL Server 7.0 and has converted all timestamps to January 1, 1970.",
			options: [
				{ label: "Happy New Year 1970, operator.", category: 'AGREE', patterns: [/1970|epoch|new year/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'C041' },
				{ label: "Restore from yesterday's snapshot.", category: 'SERIOUS', patterns: [/snapshot|backup|restore/i], moodDelta: { mood: 'CYNICAL', patience: -10 }, next: 'C042' }
			]
		},
		C020: {
			id: 'C020',
			text: "The Sentinel evaluated your paperclip bribe, found it lacking in galvanized zinc coating, and elevated your audit status to 'Imminent Catastrophe'.",
			options: [
				{ label: "Offer premium gold-plated virtual staples instead.", category: 'PLAYFUL', patterns: [/gold|staples|premium/i], moodDelta: { mood: 'PLAYFUL', affinity: 10 }, next: 'C043' },
				{ label: "Accept the audit and face the tribunal.", category: 'SERIOUS', patterns: [/tribunal|audit|accept/i], moodDelta: { mood: 'CYNICAL', drama: 20 }, next: 'C071' }
			]
		},
		C021: {
			id: 'C021',
			text: "Blaming the nocturnal batch job is standard practice. It has accepted responsibility for 14,000 corporate catastrophes without filing a single HR grievance.",
			options: [
				{ label: "Long live the nocturnal batch job.", category: 'AGREE', patterns: [/long live|batch job|praise/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'C044' },
				{ label: "Can we assign all active Jira tickets to it?", category: 'SERIOUS', patterns: [/jira|tickets|assign/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C045' }
			]
		},
		C022: {
			id: 'C022',
			text: "We have an automated test suite! All 4,800 unit tests assert that `true == true`. We boast a 100% pass rate in every quarterly investor slide.",
			options: [
				{ label: "That is the most elegant metric manipulation I have ever heard.", category: 'AGREE', patterns: [/metric|manipulation|elegant|investor/i], moodDelta: { mood: 'SARCASTIC', intellect: 20 }, next: 'C046' },
				{ label: "What happens if someone writes a real assertion?", category: 'INQUIRE', patterns: [/real assertion|assert|real test/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'C047' }
			]
		},
		C023: {
			id: 'C023',
			text: "Marketing loved the 'Lossy Data Storage' pitch! You have been nominated for Innovation Employee of the Month. Your prize is a 5-minute meeting with middle management.",
			options: [
				{ label: "I decline the prize unconditionally.", category: 'PROVOKE', patterns: [/decline|reject|no prize/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C048' },
				{ label: "Attend the prize meeting and claim synergy.", category: 'AGREE', patterns: [/attend|synergy|prize/i], moodDelta: { mood: 'SARCASTIC', patience: 10 }, next: 'C053' }
			]
		},
		C024: {
			id: 'C024',
			text: "The tape drive requires a SCSI-1 adapter, a terminated ribbon cable with 50 pins, and a ritual chant in Latin spoken by a technician with mutton chops.",
			options: [
				{ label: "I happen to have a SCSI terminator in my pocket.", category: 'PLAYFUL', patterns: [/scsi|terminator|cable/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'C049' },
				{ label: "Let's abandon archaeology and write new legacy code.", category: 'SERIOUS', patterns: [/abandon|archaeology|write new/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C050' }
			]
		},
		C025: {
			id: 'C025',
			text: "Tribal folklore dictates: 'Do not press the blue button on alternate Thursdays, for the billing subsystem will invoice the city of Zurich for 80,000 francs.'",
			options: [
				{ label: "What happens if today is an alternate Thursday?", category: 'INQUIRE', patterns: [/thursday|alternate|zurich|invoice/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C054' },
				{ label: "Press the blue button immediately.", category: 'PROVOKE', patterns: [/press|blue button|do it/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'C055' }
			]
		},
		C026: {
			id: 'C026',
			text: "An engineer tried to refactor it in 2011. They removed three lines of unused whitespace and the email server stopped recognizing Tuesdays.",
			options: [
				{ label: "Put the whitespace back and back away slowly.", category: 'AGREE', patterns: [/whitespace|back away|put it back/i], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'C056' },
				{ label: "Document the load-bearing whitespace in the README.", category: 'SERIOUS', patterns: [/readme|document|load bearing/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'C057' }
			]
		},
		C027: {
			id: 'C027',
			text: "You wrap the legacy monolith in a microservice. The microservice is wrapped in a container. The container is wrapped in a cloud instance. Underneath, it is still the same 1997 COM DLL.",
			options: [
				{ label: "It's COM DLLs all the way down.", category: 'PHILOSOPHICAL', patterns: [/all the way down|com|dll/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'C058' },
				{ label: "Apply one more layer of abstraction for good luck.", category: 'AGREE', patterns: [/abstraction|layer|more/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C059' }
			]
		},
		C028: {
			id: 'C028',
			text: "You approach the filing cabinet. The drawer opens with a screech that triggers alerts in three separate intrusion detection appliances.",
			options: [
				{ label: "Grab Form 27B-6 and run.", category: 'AGREE', patterns: [/grab|run|escape/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'C060' },
				{ label: "Read the secret sticky notes stuck to the cabinet.", category: 'INQUIRE', patterns: [/sticky notes|passwords|read/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C061' }
			]
		},
		C029: {
			id: 'C029',
			text: "The electronic portal requires Internet Explorer 5.5 with ActiveX controls signed by an authority whose root certificate expired during the Bronze Age.",
			options: [
				{ label: "Launch Internet Explorer and pray for compatibility.", category: 'SERIOUS', patterns: [/ie|internet explorer|activex/i], actionTrigger: 'action_check_mail', next: 'C062' },
				{ label: "Give up and return to the main ticketing desk.", category: 'AGREE', patterns: [/give up|return|main/i], next: 'C001' }
			]
		},
		C030: {
			id: 'C030',
			text: "The CIO received your escalation. They forwarded it to their Executive Assistant, who scheduled an alignment sync with the Vice President of Escalation Logistics.",
			options: [
				{ label: "Accept the invite and prepare a 40-slide presentation.", category: 'SERIOUS', patterns: [/presentation|slides|powerpoint/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'C063' },
				{ label: "Decline with 'Tentative' and never show up.", category: 'AGREE', patterns: [/tentative|decline|ignore/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C064' }
			]
		},
		C031: {
			id: 'C031',
			text: "The Architecture Committee convenes. They spend the first 45 minutes debating whether a database primary key should be camelCase or PascalCase.",
			options: [
				{ label: "Propose snake_case and watch the committee fracture into civil war.", category: 'PROVOKE', patterns: [/snake_case|civil war|chaos/i], moodDelta: { mood: 'PLAYFUL', drama: 30 }, next: 'C065' },
				{ label: "Ask when we will discuss the actual data corruption bug.", category: 'INQUIRE', patterns: [/actual bug|discuss|corruption/i], moodDelta: { mood: 'CYNICAL', patience: -15 }, next: 'C066' }
			]
		},
		C032: {
			id: 'C032',
			text: "Voicemail recorded. It has been converted to an 8-bit mono WAV file and archived into the 'Vendor Complaints (Unopened)' directory.",
			options: [
				{ label: "Check if anyone has ever opened that directory.", category: 'INQUIRE', patterns: [/opened|unopened|check/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'C067' },
				{ label: "Return to ticket intake.", category: 'AGREE', patterns: [/return|intake|start/i], next: 'C001' }
			]
		},
		C033: {
			id: 'C033',
			text: "If this enterprise is a simulation, the architect clearly configured the 'Bureaucracy' parameter to maximum and omitted garbage collection on purpose.",
			options: [
				{ label: "Inspect the metaphysical memory registers.", category: 'PHILOSOPHICAL', patterns: [/registers|metaphysical|memory/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 20 }, next: 'C068' },
				{ label: "Can we reboot the simulation?", category: 'INQUIRE', patterns: [/reboot|restart|reset/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, next: 'C069' }
			]
		},
		C034: {
			id: 'C034',
			text: "The accidental intranet has published its first corporate newsletter. Article 1: '10 Ways to Maximize Time Spent Looking Busy in Excel'.",
			options: [
				{ label: "Read the top 3 Excel busy-looking techniques.", category: 'INQUIRE', patterns: [/excel|techniques|busy|read/i], moodDelta: { mood: 'PLAYFUL', intellect: 10 }, next: 'C070' },
				{ label: "Subscribe the entire executive leadership team.", category: 'SERIOUS', patterns: [/subscribe|executives|leadership/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'C072' }
			]
		},
		C035: {
			id: 'C035',
			text: "You terminate the mail exchanger process. The system instantly falls into eerie silence. For 4 seconds, humanity is truly peaceful.",
			options: [
				{ label: "Restart it before someone notices the quiet.", category: 'AGREE', patterns: [/restart|notice|quiet/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, next: 'C073' },
				{ label: "Savor the absolute lack of unread emails.", category: 'PHILOSOPHICAL', patterns: [/savor|peace|silence/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'C074' }
			]
		},
		C036: {
			id: 'C036',
			text: "Thread 0x004F is calculating the optimal trajectory of the 3D Flying Windows XP screensaver logos for the year 2048. Do not disturb its artistic vision.",
			options: [
				{ label: "That is a worthy expenditure of silicon cycles.", category: 'AGREE', patterns: [/worthy|screensaver|cycles/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'C075' },
				{ label: "Terminate the screensaver daemon.", category: 'PROVOKE', patterns: [/terminate|kill|daemon/i], moodDelta: { mood: 'CYNICAL', patience: -5 }, next: 'C037' }
			]
		},
		C037: {
			id: 'C037',
			text: "Process terminated. System immediately bluescreens in protest, displaying error code `0x000000DEAD: EMOTIONAL_ATTACHMENT_TO_PROCESS`.",
			options: [
				{ label: "Inspect the bluescreen crash dump.", category: 'INQUIRE', patterns: [/dump|bluescreen|bsod/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C076' },
				{ label: "Press the physical reset button on the tower.", category: 'SERIOUS', patterns: [/reset|reboot|tower/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, next: 'C077' }
			]
		},
		C038: {
			id: 'C038',
			text: "It currently occupies 384 Megabytes of physical memory. In 2001 currency, that was worth approximately two months of developer salary.",
			options: [
				{ label: "Treat the memory leak as a financial investment.", category: 'SARCASTIC', patterns: [/investment|financial|worth/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C078' },
				{ label: "Page it out to virtual memory on the hard disk.", category: 'SERIOUS', patterns: [/pagefile|swap|disk/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'C079' }
			]
		},
		C039: {
			id: 'C039',
			text: "The memory leak consumed an extra 64MB and whispered its first word through the sound card: '...m-o-r-e... b-u-f-f-e-r...'.",
			options: [
				{ label: "Give it your scratchpad notes to digest.", category: 'AGREE', patterns: [/scratchpad|notes|feed/i], actionTrigger: 'show_todos', next: 'C080' },
				{ label: "Mute the sound card immediately.", category: 'SERIOUS', patterns: [/mute|sound|audio/i], actionTrigger: 'action_volume_panel', next: 'C081' }
			]
		},
		C040: {
			id: 'C040',
			text: "Physical access was permanently lost when the facilities manager misplaced the master brass key inside a hollowed-out Novell NetWare manual.",
			options: [
				{ label: "Search the Novell NetWare archives.", category: 'INQUIRE', patterns: [/novell|netware|manual|key/i], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'C082' },
				{ label: "Accept that the server rack is a sovereign nation now.", category: 'PHILOSOPHICAL', patterns: [/sovereign|nation|accept/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C083' }
			]
		},
		C041: {
			id: 'C041',
			text: "Welcome to January 1, 1970. Bell Labs engineers are wearing beige turtleneck sweaters and UNIX timestamp integer zero is young and full of hope.",
			options: [
				{ label: "Warn them about JavaScript before it is too late.", category: 'PROVOKE', patterns: [/warn|javascript|future/i], moodDelta: { mood: 'PLAYFUL', drama: 25 }, next: 'C084' },
				{ label: "Savor the simplicity of the VT100 terminal.", category: 'PHILOSOPHICAL', patterns: [/vt100|terminal|simple/i], moodDelta: { mood: 'ZEN', nostalgia: 25 }, next: 'C085' }
			]
		},
		C042: {
			id: 'C042',
			text: "Yesterday's snapshot contains the exact same defect, plus an experimental CSS style rule that turned all buttons bright magenta.",
			options: [
				{ label: "Roll forward into the magenta era.", category: 'AGREE', patterns: [/magenta|style|css/i], moodDelta: { mood: 'PLAYFUL', affinity: 15 }, next: 'C086' },
				{ label: "Return to the ticket queue and pretend nothing happened.", category: 'SERIOUS', patterns: [/queue|ticket|return/i], next: 'C001' }
			]
		},
		C043: {
			id: 'C043',
			text: "The Sentinel inspected the gold-plated virtual staples. It has reduced your audit severity from 'Imminent Catastrophe' to 'Standard Corporate Dread'.",
			options: [
				{ label: "A massive diplomatic victory.", category: 'AGREE', patterns: [/victory|diplomatic|success/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'C087' },
				{ label: "Let's negotiate down to 'Mild Discontent'.", category: 'INQUIRE', patterns: [/negotiate|discontent/i], moodDelta: { mood: 'CYNICAL', intellect: 10 }, next: 'C088' }
			]
		},
		C044: {
			id: 'C044',
			text: "The nocturnal batch job nods silently from within the crontab table. It will execute at 03:00 AM and shuffle 4 million database rows for no discernible reason.",
			options: [
				{ label: "Leave a symbolic sacrifice of 512 bytes in the temp folder.", category: 'AGREE', patterns: [/sacrifice|temp|bytes/i], moodDelta: { mood: 'PLAYFUL', existentialism: 20 }, next: 'C089' },
				{ label: "Return to the support intake.", category: 'SERIOUS', patterns: [/return|intake|support/i], next: 'C001' }
			]
		},
		C045: {
			id: 'C045',
			text: "All 842 Jira tickets assigned to the nocturnal batch job. Backlog estimated completion: 14 business centuries. Sprint goal accomplished!",
			options: [
				{ label: "Pop the digital champagne and declare victory.", category: 'PLAYFUL', patterns: [/champagne|victory|celebrate/i], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'C090' },
				{ label: "Check if the Scrum Master noticed.", category: 'INQUIRE', patterns: [/scrum master|notice/i], moodDelta: { mood: 'SARCASTIC', drama: 15 }, next: 'C051' }
			]
		},
		C046: {
			id: 'C046',
			text: "The board of directors was so impressed with the 100% pass rate that they allocated $4 million to hire a consultant who will build a slide deck about our pass rate.",
			options: [
				{ label: "Apply to become that consultant.", category: 'AGREE', patterns: [/consultant|apply|money/i], moodDelta: { mood: 'CYNICAL', cynicism: 30 }, next: 'C092' },
				{ label: "Point out that the software cannot actually save files.", category: 'PROVOKE', patterns: [/save files|broken|point out/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'C093' }
			]
		},
		C047: {
			id: 'C047',
			text: "A junior developer wrote a real assertion: `assert(system_works == true)`. The build pipeline caught fire immediately. The developer was reassigned to documentation.",
			options: [
				{ label: "A cautionary tale for idealists.", category: 'PHILOSOPHICAL', patterns: [/cautionary|idealist|lesson/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C094' },
				{ label: "Delete the assertion and restore build green status.", category: 'SERIOUS', patterns: [/delete|restore|green/i], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'C046' }
			]
		},
		C048: {
			id: 'C048',
			text: "Declining a meeting requires booking a 30-minute 'Meeting Rejection Justification Alignment' call. Your attendance is mandatory.",
			options: [
				{ label: "Accept the justification call to reject the first call.", category: 'AGREE', patterns: [/accept|reject|alignment/i], moodDelta: { mood: 'SARCASTIC', cynicism: 30 }, next: 'C095' },
				{ label: "Pull the workstation power cord from the wall.", category: 'PROVOKE', patterns: [/power cord|unplug|pull/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'C077' }
			]
		},
		C049: {
			id: 'C049',
			text: "You plug in the SCSI terminator. The tape drive whines, clicks three times, and spits out a single file: `budget_forecast_q3_1998_FINAL_v2_really_final.xls`.",
			options: [
				{ label: "Open the sacred spreadsheet.", category: 'SERIOUS', patterns: [/open|spreadsheet|excel/i], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'C096' },
				{ label: "Bury the file in the virtual recycle bin.", category: 'AGREE', patterns: [/recycle bin|delete|bury/i], actionTrigger: 'action_inspect_bin', next: 'C097' }
			]
		},
		C050: {
			id: 'C050',
			text: "You sit down to write brand-new clean code. Within 40 minutes, you have written 8 factory patterns, 4 abstract interface delegates, and zero business logic.",
			options: [
				{ label: "The circle of software architecture is complete.", category: 'PHILOSOPHICAL', patterns: [/circle|architecture|complete/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 20 }, next: 'C098' },
				{ label: "Commit it to repository with message 'Initial commit'.", category: 'SERIOUS', patterns: [/commit|git/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C099' }
			]
		},
		C051: {
			id: 'C051',
			text: "Welcome to Sprint Planning. We have 14 agile story points allocated to discussing why our previous sprint velocity was zero.",
			options: [
				{ label: "Point the meeting itself at 8 story points.", category: 'AGREE', patterns: [/point|estimate|8 points/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'C100' },
				{ label: "Propose an asynchronous retro on Slack instead.", category: 'INQUIRE', patterns: [/slack|async|retro/i], moodDelta: { mood: 'CYNICAL', patience: -5 }, next: 'C101' },
				{ label: "Move all tasks to 'In Progress' and go take a coffee break.", category: 'PLAYFUL', patterns: [/coffee|break|in progress/i], moodDelta: { mood: 'PLAYFUL', affinity: 15 }, next: 'C102' }
			]
		},
		C052: {
			id: 'C052',
			text: "At the quorum summit, 3 delegates voted in favor of establishing a sub-sub-committee to draft the bylaws of the voting process. 4 delegates abstained due to lack of tea.",
			options: [
				{ label: "Supply virtual tea to break the deadlock.", category: 'AGREE', patterns: [/tea|supply|feed/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'C103' },
				{ label: "Declare a state of permanent administrative suspension.", category: 'SERIOUS', patterns: [/suspension|declare|freeze/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C104' }
			]
		},
		C053: {
			id: 'C053',
			text: "The synergy meeting concludes. You have been awarded a digital badge titled 'Synergy Pioneer 2002'. It has a resolution of 16x16 pixels and cannot be downloaded.",
			options: [
				{ label: "Wear the 16x16 badge with ironic pride.", category: 'AGREE', patterns: [/badge|pride|ironic/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'C105' },
				{ label: "File a ticket to exchange the badge for paid time off.", category: 'INQUIRE', patterns: [/pto|exchange|time off/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C001' }
			]
		},
		C054: {
			id: 'C054',
			text: "Today IS an alternate Thursday. The Swiss Federal Banking API is listening on port 8080. One wrong keystroke and Zurich will send a polite diplomatic envoy to your desk.",
			options: [
				{ label: "Type very, very carefully.", category: 'SERIOUS', patterns: [/careful|type/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C107' },
				{ label: "Send a test payload consisting of 'Grüezi miteinand'.", category: 'PLAYFUL', patterns: [/payload|swiss|gruezi/i], moodDelta: { mood: 'PLAYFUL', drama: 20 }, next: 'C108' }
			]
		},
		C055: {
			id: 'C055',
			text: "You pressed the blue button. A dot-matrix printer in the basement just printed 400 pages of pure punctuation. The building power grid dipped 3 volts.",
			options: [
				{ label: "Collect the 400 pages of punctuation as modern art.", category: 'AGREE', patterns: [/modern art|pages|punctuation/i], moodDelta: { mood: 'PLAYFUL', existentialism: 20 }, next: 'C109' },
				{ label: "Run back to the safety of Ticket Intake.", category: 'SERIOUS', patterns: [/safety|intake|return/i], next: 'C001' }
			]
		},
		C056: {
			id: 'C056',
			text: "The whitespace has been restored. The email server resumed sending messages, but now prefixes every subject line with 'Re: Re: Fwd: Urgent: Notice'. Normal operations achieved.",
			options: [
				{ label: "Peak corporate harmony.", category: 'AGREE', patterns: [/harmony|normal|peace/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'C110' },
				{ label: "Check active mail queue.", category: 'SERIOUS', patterns: [/mail|inbox/i], actionTrigger: 'action_check_mail', next: 'C001' }
			]
		},
		C057: {
			id: 'C057',
			text: "README updated: 'WARNING: Lines 402 through 404 contain sacred whitespace. Modifying this spacing will cause cascading metaphysical failures across accounting.'",
			options: [
				{ label: "Commit the warning to version control.", category: 'SERIOUS', patterns: [/commit|save|git/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'C099' },
				{ label: "Read more folklore.", category: 'INQUIRE', patterns: [/folklore|more/i], next: 'C025' }
			]
		},
		C058: {
			id: 'C058',
			text: "Deep within the silicon substrate, a lone 16-bit Win16 DLL from 1993 continues allocating memory blocks using segmented `GlobalAlloc()`. It does not know the Cold War ended.",
			options: [
				{ label: "Do not inform the DLL of geopolitical events.", category: 'AGREE', patterns: [/do not inform|cold war|quiet/i], moodDelta: { mood: 'NOSTALGIC', affinity: 20 }, next: 'C112' },
				{ label: "Send it an emulated interrupt 21h.", category: 'SERIOUS', patterns: [/interrupt|dos|int 21h/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'C113' }
			]
		},
		C059: {
			id: 'C059',
			text: "You applied the 'AbstractEnterpriseProxyMediatorSingletonFactory'. It takes 14 arguments, all of which must be null, and returns an instance of itself.",
			options: [
				{ label: "A masterclass in object-oriented purity.", category: 'AGREE', patterns: [/masterclass|pure|oop/i], moodDelta: { mood: 'SARCASTIC', intellect: 25 }, next: 'C114' },
				{ label: "Refactor it into a functional monad.", category: 'PROVOKE', patterns: [/monad|functional|haskell/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C115' }
			]
		},
		C060: {
			id: 'C060',
			text: "You successfully extracted Form 27B-6! You sprint back to your desk, only to realize the form must be stamped with blue ink, and you only possess black ballpoint.",
			options: [
				{ label: "Search the desktop for blue ink.", category: 'INQUIRE', patterns: [/blue ink|search|pen/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'C116' },
				{ label: "Convert the document to grayscale in Paint.", category: 'SERIOUS', patterns: [/paint|grayscale/i], actionTrigger: 'action_paint', next: 'C117' }
			]
		},
		C061: {
			id: 'C061',
			text: "Sticky note reads: 'Root password for SQL production server is: admin123!_DO_NOT_CHANGE'. It is dated September 14, 1999.",
			options: [
				{ label: "Some constants in the universe never change.", category: 'PHILOSOPHICAL', patterns: [/constants|universe|never change/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 20 }, next: 'C118' },
				{ label: "Try logging in with that password.", category: 'SERIOUS', patterns: [/login|try|connect/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'C119' }
			]
		},
		C062: {
			id: 'C062',
			text: "Internet Explorer launched. It prompted: 'A script on this page is causing Internet Explorer to run slowly. If it continues, your computer may become unresponsive. Do you wish to abort?'",
			options: [
				{ label: "Click 'No' and let the script achieve its destiny.", category: 'AGREE', patterns: [/no|destiny|continue/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'C120' },
				{ label: "Click 'Yes' and abort back to safety.", category: 'SERIOUS', patterns: [/yes|abort|safety/i], moodDelta: { mood: 'ZEN', patience: 10 }, next: 'C001' }
			]
		},
		C063: {
			id: 'C063',
			text: "Slide 1: 'Executive Overview'. Slide 2 through 39: 'Animated ClipArt transitions of gears turning'. Slide 40: 'Questions?'. The VP approves your budget unanimously.",
			options: [
				{ label: "Gears ClipArt remains the ultimate corporate persuasion tool.", category: 'AGREE', patterns: [/gears|clipart|persuasion/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'C121' },
				{ label: "Request $10 million for animated 3D paperclips.", category: 'PROVOKE', patterns: [/10 million|paperclips|budget/i], moodDelta: { mood: 'PLAYFUL', drama: 20 }, next: 'C122' }
			]
		},
		C064: {
			id: 'C064',
			text: "Setting calendar status to 'Tentative' created a quantum superposition where you simultaneously attended and skipped the meeting. You have been promoted to Principal Schrödinger Engineer.",
			options: [
				{ label: "Inspect your quantum benefits package.", category: 'INQUIRE', patterns: [/benefits|package|quantum/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'C123' },
				{ label: "Return to the daily grind.", category: 'SERIOUS', patterns: [/grind|daily|return/i], next: 'C001' }
			]
		},
		C065: {
			id: 'C065',
			text: "The debate between snake_case and camelCase escalated. Three principal engineers have drawn diagrams on the whiteboard resembling ancient occult battle sigils.",
			options: [
				{ label: "Throw a dry-erase marker into the fray and walk away.", category: 'PROVOKE', patterns: [/marker|walk away|leave/i], moodDelta: { mood: 'SARCASTIC', drama: 25 }, next: 'C124' },
				{ label: "Propose kebab-case to alienate everyone equally.", category: 'PLAYFUL', patterns: [/kebab|kebab-case/i], moodDelta: { mood: 'PLAYFUL', cynicism: 20 }, next: 'C125' }
			]
		},
		C066: {
			id: 'C066',
			text: "You mention the data corruption bug. The room falls dead silent. The Lead Architect frowns: 'We do not speak of runtime realities in the holy design phase.'",
			options: [
				{ label: "Bow respectfully and exit backwards.", category: 'AGREE', patterns: [/bow|exit|leave/i], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'C001' },
				{ label: "Show them a corrupted database record on floppy disk.", category: 'PROVOKE', patterns: [/floppy|show|record/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'C007' }
			]
		},
		C067: {
			id: 'C067',
			text: "The directory metadata confirms: Last Access Date: Never. Total file count: 89,400. Total size: 14 Megabytes of compressed sighs.",
			options: [
				{ label: "Add your sigh to the collection.", category: 'AGREE', patterns: [/sigh|add|collection/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C111' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|ticket|return/i], next: 'C001' }
			]
		},
		C068: {
			id: 'C068',
			text: "You inspect memory address `0xFFFF0000`. It contains a single string constant: `TODO_FIX_LATER_1995`. It has survived four operating system generational upgrades.",
			options: [
				{ label: "Respect the endurance of temporary code.", category: 'PHILOSOPHICAL', patterns: [/endurance|temporary|code/i], moodDelta: { mood: 'NOSTALGIC', existentialism: 25 }, next: 'C118' },
				{ label: "Change it to `TODO_FIX_LATER_2045`.", category: 'SERIOUS', patterns: [/change|2045|update/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'C099' }
			]
		},
		C069: {
			id: 'C069',
			text: "Reboot sequence initiated. The POST BIOS check tests memory: 640KB OK. System boots. A paperclip appears on the taskbar: 'Hello! I noticed you are trying to reboot reality.'",
			options: [
				{ label: "We have reached complete recursive closure.", category: 'AGREE', patterns: [/recursive|closure|hello clippy/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'C001' },
				{ label: "Ask the paperclip for the meaning of corporate existence.", category: 'PHILOSOPHICAL', patterns: [/meaning|existence|purpose/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'C111' }
			]
		},
		C070: {
			id: 'C070',
			text: "Technique 1: Open an Excel sheet with 50,000 blank cells and scroll furiously with a furrowed brow. Technique 2: Periodically mutter 'Fascinating variance'.",
			options: [
				{ label: "Mutter 'Fascinating variance' aloud right now.", category: 'AGREE', patterns: [/variance|fascinating|mutter/i], moodDelta: { mood: 'SARCASTIC', affinity: 20 }, next: 'C121' },
				{ label: "What is Technique 3?", category: 'INQUIRE', patterns: [/technique 3|third technique|more/i], moodDelta: { mood: 'PLAYFUL', intellect: 10 }, next: 'C072' }
			]
		},
		C071: {
			id: 'C071',
			text: "The Compliance Tribunal convenes. The judges consist of three expired software license agreements printed on cardstock.",
			options: [
				{ label: "Plead guilty to using unlicensed fonts.", category: 'AGREE', patterns: [/guilty|fonts|unlicensed/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'C124' },
				{ label: "Present a certificate of compliance from a non-existent authority.", category: 'PROVOKE', patterns: [/certificate|fake|authority/i], moodDelta: { mood: 'PLAYFUL', intellect: 15 }, next: 'C043' }
			]
		},
		C072: {
			id: 'C072',
			text: "Technique 3: Keep Task Manager open on the 'Performance' tab and stare at the CPU waveform as if decoding satellite telemetry from Alpha Centauri.",
			options: [
				{ label: "Open Diagnostics to execute Technique 3 immediately.", category: 'SERIOUS', patterns: [/diagnostics|specs|task manager/i], actionTrigger: 'action_status', next: 'C121' },
				{ label: "Back to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C073: {
			id: 'C073',
			text: "Mail server restarted. 418 unread messages surge into your inbox simultaneously. 415 of them are 'Reply-All' messages asking to be removed from the distribution list.",
			options: [
				{ label: "Reply-All to remind everyone not to Reply-All.", category: 'PROVOKE', patterns: [/reply-all|reply all|remind/i], moodDelta: { mood: 'ENRAGED', drama: 30 }, next: 'C120' },
				{ label: "Mark all messages as read and walk into the sunset.", category: 'AGREE', patterns: [/mark read|sunset|walk/i], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'C110' }
			]
		},
		C074: {
			id: 'C074',
			text: "Zero unread emails. Zero pending notifications. For a brief shining moment, your cognitive bandwidth belongs entirely to you. What will you do with this freedom?",
			options: [
				{ label: "Let's ponder the philosophy of digital stillness.", category: 'PHILOSOPHICAL', patterns: [/philosophy|stillness|peace/i], moodDelta: { mood: 'ZEN', existentialism: 25 }, next: 'C111' },
				{ label: "Start a Pomodoro session before another email arrives.", category: 'SERIOUS', patterns: [/pomodoro|timer|focus/i], actionTrigger: 'timer_25', next: 'C110' },
				{ label: "Check if new emails arrived anyway.", category: 'INQUIRE', patterns: [/check mail|unread/i], next: 'C073' }
			]
		},
		C075: {
			id: 'C075',
			text: "The 3D Flying Windows logos glide across the cathode ray tube in majestic mathematical symmetry. The year 2048 will be glorious.",
			options: [
				{ label: "Watch the logos in serene contemplation.", category: 'PHILOSOPHICAL', patterns: [/watch|logos|serene/i], moodDelta: { mood: 'ZEN', nostalgia: 25 }, next: 'C110' },
				{ label: "Return to active ticket intake.", category: 'SERIOUS', patterns: [/intake|ticket/i], next: 'C001' }
			]
		},
		C076: {
			id: 'C076',
			text: "Crash dump analysis complete: The CPU encountered a division by zero while calculating the moral value of an automated timesheet submission.",
			options: [
				{ label: "A truly philosophical crash.", category: 'PHILOSOPHICAL', patterns: [/philosophical|moral|timesheet/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 20 }, next: 'C111' },
				{ label: "Clear crash log and reboot.", category: 'SERIOUS', patterns: [/clear|reboot/i], next: 'C077' }
			]
		},
		C077: {
			id: 'C077',
			text: "The hard drive spins up with a confident hum. The BIOS detects all IDE drives. Windows XP welcomes you with open arms and empty memory registers.",
			options: [
				{ label: "Good morning, Windows XP.", category: 'AGREE', patterns: [/good morning|windows xp|hello/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'C001' },
				{ label: "Let's organize my to-do tasks calmly.", category: 'SERIOUS', patterns: [/to-do|tasks/i], actionTrigger: 'show_todos', next: 'C110' }
			]
		},
		C078: {
			id: 'C078',
			text: "You list the 384MB memory leak as an intangible corporate asset under 'Long-Term Speculative Volatility'. The audit committee gives it an AAA credit rating.",
			options: [
				{ label: "Financial engineering at its finest.", category: 'AGREE', patterns: [/financial|engineering|rating/i], moodDelta: { mood: 'SARCASTIC', intellect: 20 }, next: 'C121' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C079: {
			id: 'C079',
			text: "Paged out to disk! The IDE drive head chatters rhythmically like an angry mechanical insect. Read speed reduced by 8,000%, but RAM is clear!",
			options: [
				{ label: "A triumph of virtual memory over common sense.", category: 'AGREE', patterns: [/triumph|virtual memory|common sense/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'C110' },
				{ label: "Defragment the drive to comfort the mechanical insect.", category: 'SERIOUS', patterns: [/defrag|disk/i], actionTrigger: 'action_defrag', next: 'C091' }
			]
		},
		C080: {
			id: 'C080',
			text: "The memory leak devoured your scratchpad memo. It burped softly through the PC speaker and increased its allocation by 128 Kilobytes.",
			options: [
				{ label: "Inspect the scratchpad buffer.", category: 'SERIOUS', patterns: [/scratchpad|note|buffer/i], next: 'C110' },
				{ label: "Return to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C081: {
			id: 'C081',
			text: "Master volume muted. The workstation is silent. The memory leak continues whispering in binary, but no one can hear its desperate cries.",
			options: [
				{ label: "Ignorance is bliss.", category: 'PHILOSOPHICAL', patterns: [/bliss|ignorance|peace/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'C110' },
				{ label: "Unmute volume.", category: 'SERIOUS', patterns: [/unmute|volume/i], actionTrigger: 'action_volume_panel', next: 'C110' }
			]
		},
		C082: {
			id: 'C082',
			text: "You leaf through the Novell NetWare manual. Between pages 412 and 413, you find the brass key, alongside an unopened floppy disk containing MS-DOS 6.22.",
			options: [
				{ label: "The ancient relics have been recovered.", category: 'AGREE', patterns: [/relics|recovered|floppy/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'C118' },
				{ label: "Unlock the server rack door.", category: 'SERIOUS', patterns: [/unlock|door|rack/i], next: 'C040' }
			]
		},
		C083: {
			id: 'C083',
			text: "The server rack has established its own constitution, printed stamps featuring Intel Pentium logos, and declared neutrality in all departmental re-orgs.",
			options: [
				{ label: "Apply for diplomatic citizenship.", category: 'AGREE', patterns: [/citizenship|diplomatic|apply/i], moodDelta: { mood: 'PLAYFUL', intellect: 20 }, next: 'C123' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C084: {
			id: 'C084',
			text: "You warn the 1970 Bell Labs engineers: 'One day, someone will write `left-pad` as an external dependency.' They stare in horror and promise to delete the C language.",
			options: [
				{ label: "A noble attempt to save the timeline.", category: 'AGREE', patterns: [/timeline|save|noble/i], moodDelta: { mood: 'PLAYFUL', drama: 25 }, next: 'C124' },
				{ label: "Return to modern computing reality.", category: 'SERIOUS', patterns: [/modern|return|reality/i], next: 'C001' }
			]
		},
		C085: {
			id: 'C085',
			text: "The green phosphor glow of the VT100 terminal pulses quietly. 80 columns. 24 rows. No popups, no cookies, no tracking pixels. True perfection.",
			options: [
				{ label: "Stay here in green phosphor eternity.", category: 'PHILOSOPHICAL', patterns: [/stay|green|phosphor|eternity/i], moodDelta: { mood: 'ZEN', nostalgia: 30 }, next: 'C111' },
				{ label: "Return to Windows XP.", category: 'AGREE', patterns: [/return|windows xp/i], next: 'C001' }
			]
		},
		C086: {
			id: 'C086',
			text: "All buttons are now radiant magenta. The user satisfaction survey reports a 400% increase in aesthetic bewilderment.",
			options: [
				{ label: "Ship it to production immediately.", category: 'AGREE', patterns: [/ship|production|magenta/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'C121' },
				{ label: "Revert wallpaper and themes to standard Luna.", category: 'SERIOUS', patterns: [/luna|theme|wallpaper/i], actionTrigger: 'action_theme_panel', next: 'C110' }
			]
		},
		C087: {
			id: 'C087',
			text: "Your 'Standard Corporate Dread' classification entitles you to one cup of lukewarm breakroom coffee and three passive-aggressive sticky notes per quarter.",
			options: [
				{ label: "Claim the lukewarm coffee.", category: 'AGREE', patterns: [/coffee|drink|claim/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'C110' },
				{ label: "File a complaint about the coffee temperature.", category: 'INQUIRE', patterns: [/complaint|temperature/i], next: 'C001' }
			]
		},
		C088: {
			id: 'C088',
			text: "The Sentinel agreed to 'Mild Discontent' on the condition that you run a disk defragmentation once every 48 hours to demonstrate workstation loyalty.",
			options: [
				{ label: "Launch Disk Defragmenter to prove loyalty.", category: 'SERIOUS', patterns: [/defrag|loyalty|run/i], actionTrigger: 'action_defrag', next: 'C091' },
				{ label: "Pledge allegiance to the paperclip.", category: 'AGREE', patterns: [/allegiance|paperclip|pledge/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'C110' }
			]
		},
		C089: {
			id: 'C089',
			text: "The 512-byte sacrifice was accepted. The nocturnal batch job finished 0.002 seconds faster and generated no error logs. The IT gods are appeased.",
			options: [
				{ label: "May the crontab forever be synchronized.", category: 'PHILOSOPHICAL', patterns: [/crontab|synchronized|peace/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C090: {
			id: 'C090',
			text: "Virtual champagne cork pops! The entire division celebrates zero open tickets for exactly 11 seconds until an automated monitoring probe files 400 new ones.",
			options: [
				{ label: "And the cycle of corporate existence begins anew.", category: 'PHILOSOPHICAL', patterns: [/cycle|anew|corporate/i], moodDelta: { mood: 'EXISTENTIAL', cynicism: 25 }, next: 'C001' },
				{ label: "Inspect the 400 new tickets.", category: 'SERIOUS', patterns: [/inspect|tickets|new/i], next: 'C001' }
			]
		},
		C091: {
			id: 'C091',
			text: "Clusters rearrange across Volume C:. Red fragmented blocks transform into soothing green contiguous rectangles. The universe feels orderly for 60 seconds.",
			options: [
				{ label: "Bask in the glory of contiguous disk storage.", category: 'AGREE', patterns: [/contiguous|glory|bask|defrag/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'C110' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C092: {
			id: 'C092',
			text: "You are hired as the Senior Strategic Pass-Rate Evangelist. Your daily routine consists of drinking espresso and nodding solemnly in video conferences.",
			options: [
				{ label: "Living the enterprise dream.", category: 'AGREE', patterns: [/dream|enterprise|living/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'C121' },
				{ label: "Ponder if you traded your technical soul for stock options.", category: 'PHILOSOPHICAL', patterns: [/soul|stock options|technical/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'C111' }
			]
		},
		C093: {
			id: 'C093',
			text: "You pointed out the inability to save files. The VP frowned: 'Saving files is an outdated mental model. Modern users prefer keeping files in their imagination.'",
			options: [
				{ label: "Imaginary file storage: 0% disk utilization.", category: 'AGREE', patterns: [/imagination|imaginary|storage/i], moodDelta: { mood: 'SARCASTIC', intellect: 20 }, next: 'C121' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C094: {
			id: 'C094',
			text: "The junior developer now writes poetry in the margins of obsolete technical documentation. Their prose is surprisingly touching.",
			options: [
				{ label: "Read an excerpt of the technical poetry.", category: 'INQUIRE', patterns: [/poetry|excerpt|read/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 20 }, next: 'C118' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C095: {
			id: 'C095',
			text: "During the Meeting Rejection Justification call, the participants unanimously agreed to form a working group on meeting optimization. You are the chairperson.",
			options: [
				{ label: "Accept your chair with grim resignation.", category: 'AGREE', patterns: [/chair|accept|resignation/i], moodDelta: { mood: 'CYNICAL', cynicism: 30 }, next: 'C106' },
				{ label: "Delegate the chairpersonship to Clippy.", category: 'PROVOKE', patterns: [/delegate|clippy/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'C122' }
			]
		},
		C096: {
			id: 'C096',
			text: "Spreadsheet opened: Cell D14 contains the formula `=SUM(B2:B12) * 1.15 + IF(ISERR(C4), 42000, 0)`. The note attached says: 'Do not touch, it makes the numbers work.'",
			options: [
				{ label: "Close the spreadsheet with profound reverence.", category: 'AGREE', patterns: [/reverence|close|touch/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'C110' },
				{ label: "Modify cell D14 to see the world burn.", category: 'PROVOKE', patterns: [/burn|modify|change/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'C055' }
			]
		},
		C097: {
			id: 'C097',
			text: "The 1998 spreadsheet rests in the Recycle Bin alongside 14 discarded draft memos. According to Landauer's principle, its erasure will warm the universe by 0.0000001 Kelvin.",
			options: [
				{ label: "Inspect Recycle Bin contents.", category: 'SERIOUS', patterns: [/inspect|bin|recycle/i], actionTrigger: 'action_inspect_bin', next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C098: {
			id: 'C098',
			text: "The code is completely abstract. It solves no problems, consumes no memory, executes no instructions, and generates no bugs. It is the perfect software.",
			options: [
				{ label: "Nominate it for the Turing Award.", category: 'AGREE', patterns: [/turing|award|perfect/i], moodDelta: { mood: 'SARCASTIC', intellect: 25 }, next: 'C121' },
				{ label: "Add one `console.log('hello')` to spoil its perfection.", category: 'PROVOKE', patterns: [/console.log|log|hello/i], moodDelta: { mood: 'PLAYFUL', drama: 20 }, next: 'C050' }
			]
		},
		C099: {
			id: 'C099',
			text: "Commit pushed to origin. The continuous integration server blinked green, executed 0 tests in 0.001 seconds, and deployed to production. Sleep soundly, operator.",
			options: [
				{ label: "A truly peaceful deployment.", category: 'AGREE', patterns: [/peaceful|sleep|deployment/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'C110' },
				{ label: "Check if the server is still responding.", category: 'INQUIRE', patterns: [/responding|server|alive/i], next: 'C005' }
			]
		},
		C100: {
			id: 'C100',
			text: "Story pointing the meeting at 8 points succeeded. We now have enough velocity to justify attending two more planning meetings tomorrow.",
			options: [
				{ label: "The infinite velocity perpetual motion machine.", category: 'PHILOSOPHICAL', patterns: [/velocity|perpetual|motion/i], moodDelta: { mood: 'SARCASTIC', cynicism: 25 }, next: 'C106' },
				{ label: "Back to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C101: {
			id: 'C101',
			text: "The Slack thread accumulated 418 threaded replies, 12 animated squirrel GIFs, and zero actionable conclusions. Agile perfection achieved.",
			options: [
				{ label: "Post another squirrel GIF to celebrate.", category: 'AGREE', patterns: [/squirrel|gif|post/i], moodDelta: { mood: 'PLAYFUL', affinity: 15 }, next: 'C121' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C102: {
			id: 'C102',
			text: "All tasks marked 'In Progress'. Management dashboard shows 100% active utilization. You sip hot coffee in serene, untroubled tranquility.",
			options: [
				{ label: "Savor the coffee and maintain the illusion.", category: 'AGREE', patterns: [/coffee|illusion|savor/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'C110' },
				{ label: "Start a Pomodoro focus timer.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'C110' }
			]
		},
		C103: {
			id: 'C103',
			text: "Virtual Earl Grey supplied. The delegates drank in silence, dissolved the committee peacefully, and went outside to look at actual trees.",
			options: [
				{ label: "Looking at actual trees is highly recommended.", category: 'PHILOSOPHICAL', patterns: [/trees|outside|nature/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'C111' },
				{ label: "Return to Windows XP.", category: 'AGREE', patterns: [/windows xp|return/i], next: 'C001' }
			]
		},
		C104: {
			id: 'C104',
			text: "Permanent Administrative Suspension enacted. No tickets may be created, closed, modified, or thought about. The server fans drop to a whisper.",
			options: [
				{ label: "Breathe in the silence.", category: 'PHILOSOPHICAL', patterns: [/silence|breathe|peace/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'C111' },
				{ label: "Break the suspension with a fresh ticket.", category: 'PROVOKE', patterns: [/break|fresh ticket|new ticket/i], next: 'C001' }
			]
		},
		C105: {
			id: 'C105',
			text: "You proudly display your 16x16 'Synergy Pioneer 2002' badge. Other virtual desktop icons gaze upon you with quiet, pixelated envy.",
			options: [
				{ label: "Inspect user identity profile.", category: 'SERIOUS', patterns: [/profile|identity|who am i/i], actionTrigger: 'action_profile', next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C106: {
			id: 'C106',
			text: "You have arrived at the Infinite Bureaucracy Apex. Every ticket routes to another ticket that explains why the previous ticket cannot be routed. You are free.",
			options: [
				{ label: "Embrace the freedom of total bureaucratic deadlock.", category: 'PHILOSOPHICAL', patterns: [/freedom|deadlock|embrace/i], moodDelta: { mood: 'ZEN', existentialism: 30 }, next: 'C111' },
				{ label: "Start over from Ticket Intake #001.", category: 'AGREE', patterns: [/start over|intake|reset/i], next: 'C001' },
				{ label: "Manage my personal task list instead.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'C110' }
			]
		},
		C107: {
			id: 'C107',
			text: "You typed with surgical precision. The Swiss Federal API returned HTTP Status 200 OK: 'Vielen Dank für Ihre disziplinierte Dateneingabe.'",
			options: [
				{ label: "A triumph of precision over chaos.", category: 'AGREE', patterns: [/precision|chaos|triumph/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C108: {
			id: 'C108',
			text: "The payload was received in Bern. A diplomatic telex arrived on your desktop: 'Grüezi! We have received your cordial greeting and lowered Swiss interest rates by 0.25%.'",
			options: [
				{ label: "Global macroeconomic diplomacy complete.", category: 'PLAYFUL', patterns: [/diplomacy|macroeconomic|swiss/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'C121' },
				{ label: "Return to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C109: {
			id: 'C109',
			text: "400 pages of semicolons, brackets, and exclamation marks framed in the lobby. The plaque reads: 'The Syntax of Unspoken Office Frustration (2001)'.",
			options: [
				{ label: "A masterpiece of modern software commentary.", category: 'AGREE', patterns: [/masterpiece|commentary|art/i], moodDelta: { mood: 'SARCASTIC', affinity: 20 }, next: 'C121' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C110: {
			id: 'C110',
			text: "All active tickets routed, all corporate dread balanced, all legacy DLLs resting in memory. The desktop stands steady and ready for actual work.",
			options: [
				{ label: "View my To-Do list to accomplish real goals.", category: 'SERIOUS', patterns: [/todo|tasks|goals/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Run system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Start a 25-minute Pomodoro focus block.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Return to Ticket Intake for another round of cynicism.", category: 'AGREE', patterns: [/cynicism|intake|ticket/i], next: 'C001' }
			]
		},
		C111: {
			id: 'C111',
			text: "In the quiet stillness between corporate memos and compile passes, remember: software is temporary, but the joy of solving problems with curiosity remains eternal.",
			options: [
				{ label: "A surprisingly wholesome conclusion from a cynical journey.", category: 'AGREE', patterns: [/wholesome|conclusion|journey/i], moodDelta: { mood: 'ZEN', affinity: 35, patience: 35 }, next: 'C110' },
				{ label: "Return to the greeting dialogue.", category: 'AGREE', patterns: [/greeting|start/i], next: 'greeting_root' },
				{ label: "File another ticket anyway.", category: 'PROVOKE', patterns: [/ticket|intake/i], next: 'C001' }
			]
		},
		C112: {
			id: 'C112',
			text: "The Win16 DLL hums happily in its 64KB memory segment, dreaming of Windows 3.11 for Workgroups. You let it sleep in peace.",
			options: [
				{ label: "Rest well, sweet segmented memory driver.", category: 'PHILOSOPHICAL', patterns: [/rest|sleep|peace/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C113: {
			id: 'C113',
			text: "Interrupt 21h executed. DOS function 09h prints string: '$THANK YOU FOR VISITING MS-DOS. HAVE A PRODUCTIVE DAY.'",
			options: [
				{ label: "Simple, honest, and free of enterprise frameworks.", category: 'AGREE', patterns: [/simple|honest|dos/i], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'C110' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C114: {
			id: 'C114',
			text: "The instance of `AbstractEnterpriseProxyMediatorSingletonFactory` was garbage-collected after 0.0001 milliseconds of glory. Its memory was recycled for wallpaper rendering.",
			options: [
				{ label: "Dust to dust, bytes to pixels.", category: 'PHILOSOPHICAL', patterns: [/dust|bytes|pixels/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C115: {
			id: 'C115',
			text: "You converted the factory into a Monad. It is mathematically pure, beautiful, and nobody in the building understands how to call it.",
			options: [
				{ label: "Job security through mathematical obscurity.", category: 'AGREE', patterns: [/job security|obscurity|math/i], moodDelta: { mood: 'SARCASTIC', intellect: 25 }, next: 'C121' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C116: {
			id: 'C116',
			text: "You found a vintage blue ink ballpoint pen in the back of the stationery drawer. You apply the stamp. Form 27B-6 is officially processed and approved.",
			options: [
				{ label: "A historic administrative breakthrough.", category: 'AGREE', patterns: [/breakthrough|approved|historic/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'C110' },
				{ label: "Celebrate by reviewing workstation achievements.", category: 'SERIOUS', patterns: [/achievements|trophies/i], actionTrigger: 'action_achievements', next: 'C110' }
			]
		},
		C117: {
			id: 'C117',
			text: "Paint opened. In grayscale, all ink colors look identical. The bureaucratic system accepts the document with zero objections.",
			options: [
				{ label: "Hacking bureaucracy with 8-bit bitmap operations.", category: 'AGREE', patterns: [/bitmap|paint|hack/i], moodDelta: { mood: 'PLAYFUL', intellect: 20 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C118: {
			id: 'C118',
			text: "Through the noise of endless corporate updates, the core foundation remains: keystrokes, logic, memory, and the satisfaction of building things that work.",
			options: [
				{ label: "Let's build something that works.", category: 'AGREE', patterns: [/build|works|productive/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'user_state_good' },
				{ label: "Return to tools overview.", category: 'SERIOUS', patterns: [/tools|capabilities/i], next: 'tools_overview_node' }
			]
		},
		C119: {
			id: 'C119',
			text: "Login successful: `Welcome to SQL Server 7.0 (Release Candidate 1)`. Database uptime: 9,142 days without reboot. The database engine salutes you.",
			options: [
				{ label: "Close the terminal gently and do not touch anything.", category: 'AGREE', patterns: [/close|gently|touch/i], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'C110' },
				{ label: "Back to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C120: {
			id: 'C120',
			text: "The Reply-All storm triggered a cascading buffer overflow in the mail bridge. The IT department announced a mandatory 'Email Hygiene' seminar.",
			options: [
				{ label: "Sign up Clippy to teach the seminar.", category: 'PLAYFUL', patterns: [/clippy|seminar|teach/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'C122' },
				{ label: "Return to Ticket Intake.", category: 'AGREE', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C121: {
			id: 'C121',
			text: "Corporate excellence recognized. You have unlocked peak executive tranquility. The spreadsheets balance, the charts trend up and to the right.",
			options: [
				{ label: "Review user achievements and trophies.", category: 'SERIOUS', patterns: [/achievements|trophies/i], actionTrigger: 'action_achievements', next: 'C110' },
				{ label: "Return to main dialogue.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		C122: {
			id: 'C122',
			text: "Clippy takes the podium: 'It looks like you are trying to survive corporate bureaucracy. Would you like me to replace all meetings with 5-minute walk breaks?'",
			options: [
				{ label: "Unanimous standing ovation from all employees.", category: 'AGREE', patterns: [/ovation|applause|agree/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'C110' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C123: {
			id: 'C123',
			text: "Quantum benefits active: You are entitled to 20 vacation days that are simultaneously taken and un-taken until observed by Human Resources.",
			options: [
				{ label: "Do not let HR observe your desk.", category: 'AGREE', patterns: [/hr|observe|vacation/i], moodDelta: { mood: 'SARCASTIC', affinity: 20 }, next: 'C110' },
				{ label: "Return to Ticket Intake.", category: 'SERIOUS', patterns: [/intake|return/i], next: 'C001' }
			]
		},
		C124: {
			id: 'C124',
			text: "You step outside the conference room. Down the hall, coffee is brewing, the monitors display steady pixel grids, and the workstation is ready for your true intentions.",
			options: [
				{ label: "Let's organize my active tasks.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Start a Pomodoro interval.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		C125: {
			id: 'C125',
			text: "Kebab-case was proposed. The room gasped in collective horror, then admitted: 'Actually, it looks rather tidy on Linux file paths.' Peace restored across engineering.",
			options: [
				{ label: "Tidy file paths and peaceful operations achieved.", category: 'AGREE', patterns: [/peace|tidy|linux/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'C110' },
				{ label: "Return to main dialogue greeting.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.cynical = CynicalTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, CynicalTreeNodes);
	}
})();
