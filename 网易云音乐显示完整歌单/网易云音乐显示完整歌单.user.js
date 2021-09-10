// ==UserScript==
// @name         网易云音乐显示完整歌单
// @namespace    https://github.com/nondanee
// @version      1.2.8
// @description  解除歌单歌曲展示数量限制 & 播放列表 1000 首上限
// @author       nondanee
// @match        https://music.163.com/*
// @grant        none
// ==/UserScript==
 
(() => {
	if (window.top === window.self) return
 
	const search = (object, pattern) => {
		let result = null
		Object.keys(object)
			.some(key => {
				if (!object[key]) return
				else if (typeof object[key] === 'function') {
					result = String(object[key]).match(pattern) ? [key] : null
				}
				else if (typeof object[key] === 'object') {
					const chain = search(object[key], pattern)
					result = chain ? [key].concat(chain) : null
				}
				return !!result
			})
		return result
	}
 
	const attach = (object, path, property) => {
		path = (path || []).slice()
		let poiner = object
		const last = path.pop()
		path.forEach(key => {
			if (!(key in poiner)) throw new Error('KeyError')
			poiner = poiner[key]
		})
		return property ? poiner[last] = property : poiner[last]
	}
 
	const originConfirm = attach(window.nm, search(window.nm, /okstyle\s*\|\|\s*""/))
 
	const skipEventListener = (element, type, level) => {
		const entry = Array(level).fill(null)
			.reduce(pointer => pointer.parentNode || {}, element)
 
		element.addEventListener(type, event => {
			event.stopImmediatePropagation()
			const clone = new event.constructor(event.type, event)
			Object.defineProperty(clone, 'target', { value: event.target })
			entry.dispatchEvent(clone)
		})
	}
 
	const normalize = song => {
		song = { ...song, ...song.privilege }
		return {
			...song,
			album: song.al,
			alias: song.alia || song.ala || [],
			artists: song.ar || [],
			commentThreadId: `R_SO_4_${song.id}`,
			copyrightId: song.cp,
			duration: song.dt,
			mvid: song.mv,
			position: song.no,
			ringtone: song.rt,
			status: song.st,
			pstatus: song.pst,
			version: song.v,
			songType: song.t,
			score: song.pop,
			transNames: song.tns || [],
			privilege: song.privilege,
			lyrics: song.lyrics
		}
	}
 
	const showDuration = time => {
		const pad = number => number < 10 ? '0' + number : number
		time = parseInt(time / 1000)
		const minute = parseInt(time / 60)
		const second = time % 60
		return [pad(minute), pad(second)].join(':')
	}
 
	const interceptRequest = () => {
		const location = search(window.nej || {}, '\\.replace\\("api","weapi')
		const originRequest = attach(window.nej || {}, location)
		const originRequestFunction = originRequest.toString()
 
		window.simpleRequest = (url, options = {}) =>
			new Promise((resolve, reject) =>
				originRequest(url, {
					...options,
					cookie: true,
					method: 'GET',
					onerror: reject,
					onload: resolve,
					type: 'json'
				})
			)
 
		const mapify = list => list.reduce((output, item) => ({ ...output, [item.id]: item }), {})
 
		window.scriptCache = {
			playlist: {},
			song: {},
		}
 
		window.playlistDetail = async (url, id, origin) => {
			const slice = 1000
 
			const data = await window.simpleRequest(url, { data: `id=${id}&n=${origin ? 1000 : 0}` })
			const trackIds = (data.playlist || {}).trackIds || []
			const tracks = (data.playlist || {}).tracks || []
 
			if (!trackIds.length || trackIds.length === tracks.length) return data
			if (origin) return data
 
			const batch = Math.ceil(trackIds.length / slice)
 
			const result = await Promise.all(
				Array.from(Array(batch).keys())
					.map(index => trackIds.slice(index * slice).slice(0, slice).map(({ id }) => ({ id })))
					.map(part => window.simpleRequest('/api/v3/song/detail', { data: `c=${JSON.stringify(part)}` }))
			)
 
			const songMap = mapify(Array.prototype.concat.apply([], result.map(({ songs }) => songs)))
			const privilegeMap = mapify(Array.prototype.concat.apply([], result.map(({ privileges }) => privileges)))
 
			data.playlist.tracks = trackIds
				.map(({ id }) => songMap[id] ? { ...songMap[id], privilege: privilegeMap[id] } : null)
				.filter(song => song)
			data.privileges = data.playlist.tracks
				.map(({ id }) => privilegeMap[id])
 
			window.scriptCache.playlist[id] = data.playlist.tracks
				.map(song => window.scriptCache.song[song.id] = normalize(song))
			return data
		}
 
		const overrideRequest = (url, options) => {
			if (url.includes('/playlist/detail')) {
				const data = new URLSearchParams(options.data)
				const { onload, onerror } = options
				window.playlistDetail(url, data.get('id'), true).then(onload).catch(onerror)
			}
			else {
				originRequest(url, options)
			}
		}
		overrideRequest.toString = () => originRequestFunction // call String(function) function.toString() same as origin
 
		attach(window.nej, location, overrideRequest)
	}
 
	const escapeHTML = string => (
		string.replace(
			/[&<>'"]/g,
			word =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				"'": '&#39;',
				'"': '&quot;',
			})[word] || word
		)
	)
 
	const onceMutate= (element) => new Promise((resolve) => {
		const observer = new MutationObserver(() => (observer.disconnect(), resolve()))
		observer.observe(element, { childList: true, attributes: true, subtree: 'true' })
	})
 
	const completePlaylist = () => {
 
		const render = (song, index, playlist) => {
			const { album, artists, status, duration } = song
			const deletable = playlist.creator.userId === window.GUser.userId
			const durationText = showDuration(duration)
			const artistText = artists.map(({ name }) => escapeHTML(name)).join('/')
			const annotation = escapeHTML(song.transNames[0] || song.alias[0] || '')
			const albumName = escapeHTML(album.name)
			const songName = escapeHTML(song.name)
 
			return `
				<tr id="${song.id}${Date.now()}" class="${index % 2 ? '' : 'even'} ${status ? 'js-dis' : ''}">
					<td class="left">
						<div class="hd "><span data-res-id="${song.id}" data-res-type="18" data-res-action="play" data-res-from="13" data-res-data="${playlist.id}" class="ply ">&nbsp;</span><span class="num">${index + 1}</span></div>
					</td>
					<td>
						<div class="f-cb">
							<div class="tt">
								<div class="ttc">
									<span class="txt">
										<a href="#/song?id=${song.id}"><b title="${songName}${annotation ? ` - (${annotation})` : ''}">${songName}</b></a>
										${annotation ? `<span title="${annotation}" class="s-fc8">${annotation ? ` - (${annotation})` : ''}</span>` : ''}
										${song.mvid ? `<a href="#/mv?id=${song.mvid}" title="播放mv" class="mv">MV</a>` : ''}
									</span>
								</div>
							</div>
						</div>
					</td>
					<td class=" s-fc3">
						<span class="u-dur candel">${durationText}</span>
						<div class="opt hshow">
							<a class="u-icn u-icn-81 icn-add" href="javascript:;" title="添加到播放列表" hidefocus="true" data-res-type="18" data-res-id="${song.id}" data-res-action="addto" data-res-from="13" data-res-data="${playlist.id}"></a>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="fav" class="icn icn-fav" title="收藏"></span>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="share" data-res-name="${albumName}" data-res-author="${artistText}" data-res-pic="${album.picUrl}" class="icn icn-share" title="分享">分享</span>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="download" class="icn icn-dl" title="下载"></span>
							${deletable ? `<span data-res-id="${song.id}" data-res-type="18" data-res-from="13" data-res-data="${playlist.id}" data-res-action="delete" class="icn icn-del" title="删除">删除</span>` : ''}
						</div>
					</td>
					<td>
						<div class="text" title="${artistText}">
							<span title="${artistText}">
								${artists.map(({ id, name }) => `<a href="#/artist?id=${id}" hidefocus="true">${escapeHTML(name)}</a>`).join('/')}
							</span>
						</div>
					</td>
					<td>
						<div class="text">
							<a href="#/album?id=${album.id}" title="${albumName}">${albumName}</a>
						</div>
					</td>
				</tr>
			`
		}
 
		const playlistId = (window.location.href.match(/playlist\?id=(\d+)/) || [])[1]
 
		const action = async () => {
			const seeMore = document.querySelector('.m-playlist-see-more')
			if (seeMore) seeMore.innerHTML = '<div class="text">更多内容加载中...</div>'
			const data = await window.playlistDetail('/api/v6/playlist/detail', playlistId)
			const { playlist } = data
			const content = playlist.tracks.map((song, index) => render(normalize(song), index, playlist)).join('')
 
			const replace = () => {
				document.querySelector('table tbody').innerHTML = content
				proxyAction()
				seeMore && seeMore.parentNode.removeChild(seeMore)
			}
 
			if (document.querySelector('table'))
				replace()
			else
				onceMutate(document.querySelector('.g-mn3.f-pr.j-flag .f-pr')).then(replace)
		}
 
		if (playlistId) action()
	}
 
	const proxyAction = (table) => {
		const targetAction = new Set(['play', 'addto'])
		const typeMap = { song: '18', playlist: '13' }
 
		const handler = (event, type) => {
			const { resType, resAction, resId, resFrom, resData } = event.target.dataset
			if (resAction === 'delete') {
				const action = value => value === 'ok' && window.simpleRequest(
					'/api/playlist/manipulate/tracks',
					{ data: `op=del&pid=${resData}&trackIds=[${resId}]` }
				)
					.then(({ code }) => code === 200 && completePlaylist())
				originConfirm({ btnok: '确定', btncc:'取消', message:'确定删除歌曲？', action })
			}
			if (typeMap[type] !== resType || !targetAction.has(resAction)) return
 
			const list = ((window.scriptCache || {})[type] || {})[resId]
			if (!list) return
 
			event.stopPropagation()
			window.top.player.addTo(
				Array.isArray(list) ? list : [list],
				resAction === 'play' && type === 'playlist',
				resAction === 'play'
			)
		}
 
		const operationElement = document.querySelector('#content-operation') || document.querySelector('#flag_play_addto_btn_wrapper')
 
		if (operationElement) {
			const contentPlay = operationElement.querySelector('.u-btni-addply')
			const contentAdd = operationElement.querySelector('.u-btni-add')
 
			if (contentPlay) contentPlay.addEventListener('click', event => handler(event, 'playlist'))
			if (contentAdd) contentAdd.addEventListener('click', event => handler(event, 'playlist'))
		}
 
		const tableBody = document.querySelector('table tbody')
		if (tableBody) tableBody.addEventListener('click', event => handler(event, 'song'))
		const tableWrap = document.querySelector('table')
		if (tableWrap) skipEventListener(tableWrap, 'click', 3) // default listener throw an error
	}
 
	interceptRequest()
 
	window.addEventListener('load', completePlaylist, false)
	window.addEventListener('hashchange', completePlaylist, false)
})()
