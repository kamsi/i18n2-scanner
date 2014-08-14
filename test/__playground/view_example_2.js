'use strict';

var _ = require('mano').i18n.bind('forms')
	, db = require('mano').db
	, baseUrl = url
	, incompleteFormNav = require('eregistrations/view/components/incomplete-form-nav')
	, userProto = db.User.prototype, legacyProto;

legacyProto = {
	estimateIncome: userProto.$get('estimateIncome')._value_,
	taxEstimateIncome: userProto.$get('taxEstimateIncome')._value_,
	totalTax: userProto.$get('totalTax')._value_
};

exports.main = function () {
	var url = baseUrl.bind(this.root), user = this.user, yearEnd = new Date(),
		customPetitionerId = user.__id__ + '/customPetitioner', petitionerSelectMatchOpts = {},
		incompleteFormInfo = [
			{
				status: user._businessPremisesStatus,
				url: '#business-premises',
				msg: 'Business premises are not completed'
			},
			{
				status: user._businessActivityStatus,
				url: '#business-activity',
				msg: 'Business Activity is incomplete'
			},
			{
				status: user._secretaryStatus,
				url: '#secretary',
				msg: 'Secretary form is incomplete'
			},
			{
				status: user._partnersStatus,
				url: '#partners',
				msg: 'The directors and subscribers section is incomplete'
			},
			{
				status: user._incomeTaxStatus,
				url: '#income-tax',
				msg: 'Estimate of income tax is incomplete'
			},
			{
				status: user._employerStatus,
				url: '#employer',
				msg: 'Employer infromation is incomplete'
			},
			{
				status: user._petitionerStatus,
				url: '#petitioner-information',
				msg: 'Information on the petitioner is incomplete'
			}
		],
		customPetitionerFieldListids = ['petitioner-information-custom-petitioner-firstName',
			'petitioner-information-custom-petitioner-lastName',
			'petitioner-information-custom-petitioner-isAuthorized',
			'petitioner-information-custom-petitioner-companyRole',
			'petitioner-information-custom-petitioner-phoneNumber',
			'petitioner-information-custom-petitioner-email'];
	yearEnd.setMonth(11);
	yearEnd.setDate(31);

	legacyProto.__id__ = user.__id__;
	div(_if(not(eq(user._guideStatus, 1)), section({ class: 'prev-empty-alert' },
			p(a({ href: url() }, _("Please fill the Guide first"))))),
		section({ class: 'subheader' }, h1(span({ class: 'step' }, "2"), _("FILL THE FORM")),
			p({ class: 'bigfont' }, _("All the mandatory fields must be filled."),
				' (', span({ class: 'required-status' }, '*'), ').')));

	div({ class: _if(not(eq(user._guideStatus, 1)), 'disabled') },
		//Company name
		section({ class: "borderd borderd-verify" }, form({ method: 'post', action: url('company'),
				id: 'form-company', class: _if(user._companyName, 'completed') },
			p(label(field({ dbjs: user._companyName }))),
			p(a({ class: 'btn btn-large btn-color1',
						href: 'http://www.brela-tz.org/?section=companies&page=search',
						target: "_blank" },
					"Check company names"),
				a({ class: 'btn btn-large btn-color1',
						href: 'http://www.brela-tz.org/?section=business&page=search',
						target: "_blank" },
					"Check business name"),
				input({ class: "btn btn-danger", type: "submit", value: "Save" })),
			p("The chosen company name must be different from any business and company names" +
					" registered in Tanzania. Please check existing names by clicking on those two" +
					" buttons. In addition, the chosen name should not " +
					"be any well-known international trademark." +
					" For more information on how to choose a company name, please refer to ",
				a({ target: '_blank', href: 'http://www.brela-tz.org/htmls/guidelines%20for%20' +
						'company%20and%20business%20names%20approvals.pdf' },
					"the guidelines from Business Registration and Licensing Agency (BRELA)"), '.'))),

		//Business premises
		section({ id: 'business-premises',
			class: 'borderd' }, form({ method: 'post', action: url('business-premises'),
				id: 'form-business-premises', class: _if(eq(user._businessPremisesStatus, 1),
					'completed') },
			h2("Business premises (company headquarters)"),

			h4("Contact numbers"),
			fieldset({ dbjs: user, names: user.businessContactProperties,
				controls: {
					phoneNumber: { input: { class: 'form-input-medium' } },
					phoneNumber2: { input: { class: 'form-input-medium' } },
					phoneNumber3: { input: { class: 'form-input-medium' } },
					fax: { input: { class: 'form-input-medium' } }
				} }),

			h4("Address of headquarters"),
			fieldset({
				id: 'fieldset-business-address',
				dbjs: user,
				names: user.businessAddressProperties,
				controls: {
					country: { control: { id: 'select-business-address-country', disabled: true } },
					region: { id: 'tr-business-address-region' },
					postalCity: { id: 'tr-business-address-postal-city' },
					plot: { input: { class: 'form-input-small' } },
					block: { input: { class: 'form-input-small' } },
					POBox: { input: { class: 'form-input-small' } }
				}
			}),
			legacy('selectMatch', 'select-business-address-country',
				{ TZ: 'tr-business-address-region' }),
			legacy('radioMatch', 'fieldset-business-address',
					user.__id__ + '/businessAddress/isPostalCitySame',
				{ 0: 'tr-business-address-postal-city' }),

			_if(not(user._isPremisesOwner),
				[h4("Landlord information"),
					fieldset({
						dbjs: user,
						names: user.businessTaxPayerProperties,
						controls: {
							landlordTin: { input: { class: 'form-input-small' } },
							landlordPin: { input: { class: 'form-input-small' } }
						}
					})]),

			p({ class: 'submit' }, input({ class: "btn btn-danger", type: 'submit',
				value: _("Save") })),
			a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' }, _('Top')))),

		//Business activity
		section({ class: "borderd",
			id: 'business-activity' }, form({ method: 'post', action: url('business-activity'),
				id: 'form-business-activity', class: _if(eq(user._businessActivityStatus, 1),
					'completed') },
			h2("Business activity"),
			fieldset({
				dbjs: user,
				names: user.businessActivityProperties,
				controls: {
					businessActivity: { label: "Category of business activity",
						input: { id: 'input-business-licence' } },
					startDate: { value: new Date() },
					accountYearEnd: { id: 'tr-account-year-end', value: yearEnd }
				},
				append: tr(td(), td(input({ class: "btn btn-danger",
					type: 'submit', value: _("Save") })))
			})), a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' }, _('Top'))),

		//Company secretary
		section({ id: 'secretary',
				class: "borderd" }, form({ method: 'post', action: url('secretary'),
					id: 'form-secretary', class: _if(eq(user._secretaryStatus, 1), 'completed') },
				h2("Company secretary"),
				fieldset({
					dbjs: user,
					names: user.secretaryBaseProperties,
					controls: {
						title: { input: { class: 'form-input-xsmall' } }
					}
				}),
				h4("Residential address"),
				fieldset({
					dbjs: user,
					names: user.secretaryAddressProperties,
					controls: {
						postalCity: { id: 'tr-secretary-postal-city' },
						plot: { input: { class: 'form-input-small' } },
						block: { input: { class: 'form-input-small' } },
						POBox: { input: { class: 'form-input-small' } }
					},
					append: tr(td(), td(input({ class: "btn btn-danger",
						type: 'submit', value: _("Save") })))
				})), a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' }, _('Top')),
			legacy('radioMatch', 'form-secretary', user.__id__ + '/secretary/address/isPostalCitySame',
				{ 0: 'tr-secretary-postal-city' })),

		//Directors/owners/partners
		section({ id: 'partners',
				class: _if(eq(user._partnersStatus, 1), 'borderd completed', 'borderd') },
			h2("Directors & non-directors owner / partners"),
			p(["You have registered ", user.directors._size, " director",
				_if(eq(user.directors._size, 1), '', 's'), " and ", user.subscribers._size,
				" subscriber", _if(eq(user.subscribers._size, 1), '', 's'), ". ",
				_if(or(user._directorsLeftToRegister, user._subscribersLeftToRegister),
					["You still need to register",
						_if(user._directorsLeftToRegister,
							[" ", user._directorsLeftToRegister, " director",
								_if(eq(user._directorsLeftToRegister, 1), '', 's')]),
						_if(and(user._directorsLeftToRegister, user._subscribersLeftToRegister), " and "),
						_if(user._subscribersLeftToRegister,
							[" ", user._subscribersLeftToRegister, " subscriber",
								_if(eq(user._subscribersLeftToRegister, 1), '', 's')]), "."])]),
			table({ class: 'table table-striped table-bordered' },
				thead(tr(th('Entity'), th('First name'), th('Surname'), th('Director?'),
					th('Subscriber?'), th(), th())),
				tbody({ onEmpty: tr(td({ colspan: 7 })) }, user.partners, function (partner) {
					td(_if(partner._parentCompanyName, partner._parentCompanyName, 'NA'));
					td(_if(partner._firstName, partner._firstName, 'NA'));
					td(_if(partner._lastName, partner._lastName, 'NA'));
					td(_if(eq(partner._companyRole, 'director'), 'Yes', 'No'));
					td(_if(user.subscribers._has(partner), 'Yes', 'No'));
					td({ class: _if(eq(partner._status, 1), 'complete') },
						span({ class: 'validation-status' }, '✓'));
					td(a({ class: "edit-icn",  href: url('partner', partner.__id__) },
							i({ class: 'icon-pencil' })),
						postButton({ action: url('partner', partner.__id__, 'delete'),
							value: i({ class: 'icon-trash' }), confirm: "Are you sure?" }));
				})),
			p(a({ class: 'btn btn-large btn-color2', href: url('partner', 'add') },
				"Add a director or subscriber")), a({ class: 'label pull-right',
				onclick: 'window.scroll(0, 0)' }, _('Top'))),

		//Income tax
		section({ class: 'borderd',
			id: 'income-tax' }, form({ method: 'post', action: url('income-tax'),
				id: 'form-income-tax', class: _if(eq(user._incomeTaxStatus, 1), 'completed') },
			h2("Estimate of income tax"),
			fieldset({
				dbjs: user,
				names: user.incomeTaxProperties,
				controls: {
					netProfit: { control: { id: 'input-net-profit' } },
					investmentIncome: { control: { id: 'input-investment-income' } },
					estimateIncome: { control: { id: 'input-estimate-income', disabled: true } },
					totalTax: { control: { id: 'input-total-tax', disabled: true } }
				}
			}),

			h4("Instalment payable"),
			fieldset(table(tbody([1, 2, 3, 4], function (num) {
				tr({ id: 'tr-instalment-' + num },
					th(user.$get('instalment' + num).label),
					td(input({ dbjs: user['_instalment' + num],
						control: { id: 'input-instalment-' + num } })),
					td("Due date: "), td({ id: 'td-instalment-' + num + '-Date' },
						span({ id: 'span-instalment-' + num + '-date' },
							user['_instalment' + num + 'Date'])));
			}))),
			p({ class: 'error-message error-message-instalment' }),
			p({ class: 'submit' }, input({ class: "btn btn-danger", type: 'submit',
				value: _("Save") })),
			a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' }, _('Top')))),

		script(function (proto) {
			var form = $('form-income-tax'), netProfit = $('input-net-profit'),
				investmentIncome = $('input-investment-income'),
				estimateIncome = $('input-estimate-income'),
				totalTax = $('input-total-tax'),
				stateTotal,
				instEls = [],
				User = function () {};
			User.prototype = proto;

			$.forEach([1, 2, 3, 4], function (num) {
				instEls.push({ tr: $('tr-instalment-' + num), input: $('input-instalment-' + num),
					date: $('span-instalment-' + num + '-date').firstChild });
			});

			$.onEnvUpdate(form, function () {
				var user = new User(), instalments, instalmentsLen;
				user.netProfit = Math.round(Number(netProfit.value)) || 0;
				user.investmentIncome = Math.round(Number(investmentIncome.value)) || 0;

				//$.dbjsFormFill(user, form);
				user.estimateIncome = user.estimateIncome();
				user.totalTax = user.totalTax();

				estimateIncome.value = Math.round(user.estimateIncome);
				totalTax.value = Math.round(user.totalTax);

				setTimeout(function () {
					if (stateTotal !== totalTax.value) {
						stateTotal = totalTax.value;
						instalments = $.calculateInstalments(stateTotal);
						instalmentsLen = instalments.instalments.length;

						$.forEach([1, 2, 3, 4], function (num) {
							var idx = Number(num - 1);
							instEls[idx].tr.toggle(instalmentsLen > idx);

							if (instalmentsLen > idx) {
								instEls[idx].input.value = instalments.instalments[idx];
								instEls[idx].date.data = instalments.dates[idx].toLocaleDateString();
							}
						});
					}
				}, 0);
			});
		}, legacyProto),

		//Employer information
		_if(user.requestedDocuments._has('sser'),
			section({ class: 'borderd', id: 'employer' },
				form({ method: 'post', action: url('employer'), id: 'form-employer',
						class: _if(eq(user._employerStatus, 1), 'completed') }, h2("Employer information"),
					fieldset({ dbjs: [user._numberOfEmployees], controls: {
						numberOfEmployees: { input: { class: 'form-input-xsmall' } }
					}
					}),
					h4("Human resource person contact details"),
					user.toDOMFieldset(document, {
						names: user.hrPersonProperties,
						controls: {
							title: { input: { class: 'form-input-xsmall' } },
							phoneNumber: { input: { class: 'form-input-medium' } },
							phoneNumber2: { input: { class: 'form-input-medium' } },
							phoneNumber3: { input: { class: 'form-input-medium' } },
							fax: { input: { class: 'form-input-medium' } }
						},
						append: tr(td(),
							td(input({ class: "btn btn-danger", type: 'submit', value: _("Save") })))
					})
				), a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' },
					_('Top')))),

		//Petitioner inforamtion
		section({ class: "borderd",
				id: 'petitioner-information' },
			h2("Information on the petitioner"),
			form({ method: 'post', action: url('petitioner-information'),
					id: 'form-petitioner-information',
					class: _if(eq(user._petitionerStatus, 1), 'completed') },
				fieldset({
					id: 'petitioner-information-custom-petitioner',
					dbjs: user,
					names: user.customPetitionerProperties,
					controls: {
						petitioner: { input: {
							id: 'petitioner-information-select-petitioner',
							class: 'form-input-medium',
							dbjs: user._petitioner,
							list: user.potentionalPetitioners,
							getOptionLabel: function (partner) {
								return _if(eq(partner, user.customPetitioner), "Other", partner._fullName);
							}
						} },
						firstName: { id: 'petitioner-information-custom-petitioner-firstName',
							control: { class: 'form-input-medium' } },
						lastName: { id: 'petitioner-information-custom-petitioner-lastName',
							control: { class: 'form-input-medium' } },
						isAuthorized: { id: "petitioner-information-custom-petitioner-isAuthorized",
							input: { class: 'form-input-medium' } },
						companyRole: {
							id: "petitioner-information-custom-petitioner-companyRole",
							control: { class: 'form-input-medium' }
						},
						phoneNumber: { id: 'petitioner-information-custom-petitioner-phoneNumber',
							control: { class: 'form-input-medium' } },
						email: { id: 'petitioner-information-custom-petitioner-email',
							control: { class: 'form-input-medium' } }
					}
				}),
				p({ class: 'submit' }, input({ class: "btn btn-danger", type: 'submit',
					value: _("Save") }))),
			a({ class: 'label pull-right', onclick: 'window.scroll(0, 0)' },
				_('Top'))), div({ class: 'disabler' }));

	petitionerSelectMatchOpts[customPetitionerId] = customPetitionerFieldListids;
	legacy('selectMatch', 'petitioner-information-select-petitioner',
		petitionerSelectMatchOpts);
	legacy('radioMatch', 'petitioner-information-custom-petitioner',
			user.__id__ + '/customPetitioner/isAuthorized',
		{ 0: 'petitioner-information-custom-petitioner-companyRole' });

	div(div({ id: 'modal-mark', class: 'modal partner hidden' }),
		div(_if(eq(user._dataStatus, 1), section({ class: 'nextSection' },
			a({ href: url('documents'), class: 'btn btn-large btn-danger' },
				_("Continue to next step"))))));
	incompleteFormNav(incompleteFormInfo);
};
