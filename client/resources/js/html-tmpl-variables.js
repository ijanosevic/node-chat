// various html component templates
const chat_room_list_item_html_tmpl = `<li class="collection-item avatar" data-id="%id%" onclick="displayChatRoom(this)">
						<img src="%picture_url%" alt="" class="circle">
						<span class="title">%title%</span>
						<p>%last_message%</p>
						<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
					</li>`;

const contact_list_item_html_tmpl = `<li class="collection-item avatar" data-id="%id%" onclick="console.log('nadji chat room ili zapocni novi');">
						<img src="%picture_url%" alt="" class="circle">
						<span class="title">%title%</span>
						<p>Last seen: %time%</p>
					</li>`;

const selectable_contact_list_item_html_tmpl = `<li class="collection-item avatar" data-id="%id%" onclick="clientToFromRoom(this)">
						<input type="checkbox" name="new-group-members"/>
						<img src="%picture_url%" alt="" class="circle">
						<span class="title">%title%</span>
						<p>Last seen: %time%</p>
					</li>`;

const selected_contact_html_tmpl = `<a href="#" data-id="%id%" onclick="removeFromRoom(this)" >
						<div class="contact-image-wrapper">
							<img src="%picture_url%" alt="" class="circle">
						</div>
						<span>%title%</span>
					</a>`;

const message_container_html_tmpl = `<li class="%className%">
						<i class="material-icons circle orange">%initials%</i>
						<p>%content% <span class="time">%time%</span></p>
					</li>`;
